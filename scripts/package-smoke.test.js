const assert = require('node:assert/strict')
const { tmpdir } = require('node:os')
const { execFileSync } = require('node:child_process')
const { cp, mkdtemp, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } = require('node:fs/promises')
const path = require('node:path')
const test = require('node:test')

const root = path.resolve(__dirname, '..')
const run = (command, args, cwd) => execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' })

// Use packed files for Canon; link only installed third-party dependencies for offline CI.
async function tempDir(t, prefix) {
  const temp = await mkdtemp(path.join(tmpdir(), prefix))
  t.after(() => rm(temp, { recursive: true, force: true }))
  return temp
}

const files = (directory, prefix = '') => readdir(directory, { withFileTypes: true }).then((entries) => Promise.all(
  entries.map((entry) => entry.isDirectory()
    ? files(path.join(directory, entry.name), `${prefix}${entry.name}/`)
    : [`${prefix}${entry.name}`]),
)).then((lists) => lists.flat().sort())

async function packedConsumer(t) {
  const temp = await tempDir(t, 'canon-package-smoke-')
  const consumer = path.join(temp, 'consumer')
  await mkdir(path.join(consumer, 'node_modules/@canon'), { recursive: true })
  await writeFile(path.join(consumer, 'package.json'), '{"type":"module"}\n')
  for (const name of ['tokens', 'cli']) {
    const packed = JSON.parse(run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temp, '--cache', path.join(temp, 'npm-cache')], path.join(root, 'packages', name)))[0]
    const target = path.join(name === 'cli' ? temp : consumer, 'node_modules/@canon', name)
    await mkdir(path.dirname(target), { recursive: true })
    await mkdir(target)
    run('tar', ['-xzf', path.join(temp, packed.filename), '--strip-components=1', '-C', target], consumer)
  }
  for (const [name, from] of [['picocolors', 'cli'], ['style-dictionary', 'tokens']]) {
    const dependency = await realpath(path.join(root, 'packages', from, 'node_modules', name))
    await symlink(dependency, path.join(name === 'picocolors' ? temp : consumer, 'node_modules', name))
  }
  return { consumer, temp, cli: path.join(temp, 'node_modules/@canon/cli/dist/index.js') }
}

test('the tokens package ships only the public outputs even when stale build files exist', async (t) => {
  const temp = await tempDir(t, 'canon-pack-files-')
  const source = path.join(root, 'packages/tokens')
  for (const entry of ['package.json', 'dist', 'tokens', 'scripts']) {
    await cp(path.join(source, entry), path.join(temp, entry), { recursive: true })
  }
  await writeFile(path.join(temp, 'dist/index.js'), '// stale tsup output\n')
  await mkdir(path.join(temp, 'dist/js'), { recursive: true })
  await writeFile(path.join(temp, 'dist/js/tokens.js'), '// stale token module\n')
  const packed = JSON.parse(run('npm', ['pack', '--dry-run', '--ignore-scripts', '--json', '--cache', path.join(temp, 'npm-cache')], temp))[0]
  const tokenFiles = (await readdir(path.join(source, 'tokens'))).map((file) => `tokens/${file}`)
  assert.deepEqual(packed.files.map((file) => file.path).sort(), [
    'dist/css/variables.css', 'dist/index.cjs', 'dist/index.d.cts', 'dist/index.d.ts', 'dist/index.mjs',
    'dist/tailwind/preset.js', 'package.json', 'scripts/build.js', ...tokenFiles,
  ].sort())
})

test('packed tokens expose the originals and CSS/TS/Tailwind public imports', async (t) => {
  const { consumer } = await packedConsumer(t)
  const output = run(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    import { readFileSync } from 'node:fs';
    import { tokens } from '@canon/tokens';
    import preset from '@canon/tokens/tailwind';
    const require = createRequire(import.meta.url);
    const commonjs = require('@canon/tokens');
    assert.equal(commonjs.tokens.spacing[4], 'var(--spacing-4)');
    const original = JSON.parse(readFileSync(require.resolve('@canon/tokens/tokens/color.json')));
    assert.equal(original.color.white.$value, '#ffffff');
    assert.equal(tokens.semantic.text.primary, 'var(--semantic-text-primary)');
    assert.equal(preset.theme.extend.colors.semantic.text.primary, 'var(--semantic-text-primary)');
    assert.match(readFileSync(require.resolve('@canon/tokens/css'), 'utf8'), /--semantic-text-primary:/);
    console.log('packed imports passed');
  `], consumer)
  assert.match(output, /packed imports passed/)
  await assert.rejects(readFile(path.join(consumer, 'node_modules/@canon/tokens/dist/js/tokens.js')), { code: 'ENOENT' })
  await writeFile(path.join(consumer, 'consumer.ts'), `
    import { tokens, type Tokens } from '@canon/tokens'
    const spacing: Tokens['spacing'][4] = tokens.spacing[4]
    // @ts-expect-error token references are strings, not raw numbers
    const invalid: number = spacing
  `)
  const tsc = require.resolve('typescript/bin/tsc')
  run(process.execPath, [tsc, '--noEmit', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--strict', '--skipLibCheck', 'consumer.ts'], consumer)
})

test('npx-style eject uses the consumer tokens and rebuilds identical Canon CSS', async (t) => {
  const { consumer, cli } = await packedConsumer(t)
  await mkdir(path.join(consumer, 'src/styles'), { recursive: true })
  await writeFile(path.join(consumer, 'src/styles/app.css'), '/* user styles */\n')
  const output = run(process.execPath, [cli, 'eject'], consumer)
  const { peerDependencies, peerDependenciesMeta } = JSON.parse(await readFile(path.join(consumer, 'node_modules/@canon/tokens/package.json'), 'utf8'))
  assert.equal(peerDependencies['style-dictionary'], '^4.1.4')
  assert.equal(peerDependenciesMeta['style-dictionary'].optional, true)
  assert.match(output, /style-dictionary@\^4\.1\.4/)
  for (const file of await readdir(path.join(consumer, 'node_modules/@canon/tokens/tokens'))) {
    assert.equal(await readFile(path.join(consumer, 'canon/tokens', file), 'utf8'), await readFile(path.join(consumer, 'node_modules/@canon/tokens/tokens', file), 'utf8'))
  }
  const original = await readFile(path.join(consumer, 'node_modules/@canon/tokens/dist/css/variables.css'), 'utf8')
  run(process.execPath, ['canon/build.mjs'], consumer)
  assert.equal(await readFile(path.join(consumer, 'src/styles/canon-variables.css'), 'utf8'), original)
  assert.deepEqual(await files(path.join(consumer, 'src/styles')), ['app.css', 'canon-variables.css'])
  assert.deepEqual(await files(path.join(consumer, 'canon/dist')), ['css/variables.css', 'tailwind/preset.js'])
  assert.equal(await readFile(path.join(consumer, 'src/styles/app.css'), 'utf8'), '/* user styles */\n')
  const custom = path.join(consumer, 'canon/tokens/color.json')
  const color = JSON.parse(await readFile(custom, 'utf8'))
  color.color.white.$value = '#fefefe'
  await writeFile(custom, JSON.stringify(color))
  run(process.execPath, ['canon/build.mjs'], consumer)
  assert.match(await readFile(path.join(consumer, 'src/styles/canon-variables.css'), 'utf8'), /--color-white: #fefefe;/)
  await writeFile(custom, '{"user":"preserve"}\n')
  await writeFile(path.join(consumer, 'canon/build.mjs'), '// user build\n')
  run(process.execPath, [cli, 'eject'], consumer)
  assert.equal(await readFile(custom, 'utf8'), '{"user":"preserve"}\n')
  assert.equal(await readFile(path.join(consumer, 'canon/build.mjs'), 'utf8'), '// user build\n')
})

test('packed init creates a usable brand override and preserves an existing stylesheet', async (t) => {
  const { consumer, cli } = await packedConsumer(t)
  run(process.execPath, [cli, 'init'], consumer)
  const stylesheet = path.join(consumer, 'canon.css')
  const css = await readFile(stylesheet, 'utf8')
  assert.match(css, /@import '@canon\/tokens\/css'/)
  assert.match(css, /--brand-500: #[0-9a-f]{6};/)
  await assert.rejects(readFile(path.join(consumer, 'canon.config.json')), { code: 'ENOENT' })
  await writeFile(stylesheet, '/* user CSS */\n')
  run(process.execPath, [cli, 'init'], consumer)
  assert.equal(await readFile(stylesheet, 'utf8'), '/* user CSS */\n')
})

test('packed commands exit unsuccessfully when source resolution, copying, or token compilation fails', async (t) => {
  const { consumer, cli, temp } = await packedConsumer(t)
  const missing = path.join(temp, 'missing-consumer')
  await mkdir(missing)
  assert.throws(() => run(process.execPath, [cli, 'eject'], missing), (error) => {
    assert.equal(error.status, 1)
    assert.match(error.stderr, /@canon\/tokens 패키지를 찾을 수 없습니다/)
    assert.doesNotMatch(error.stderr, /^\s+at /m, 'expected CLI errors print the message without a stack')
    return true
  })
  await writeFile(path.join(consumer, 'canon'), 'blocks token directory creation')
  assert.throws(() => run(process.execPath, [cli, 'eject'], consumer), (error) => error.status === 1)
  assert.throws(() => run(process.execPath, [cli, 'unknown'], consumer), (error) => error.status === 1)
  await symlink(path.join(consumer, 'node_modules'), path.join(missing, 'node_modules'))
  run(process.execPath, [cli, 'eject'], missing)
  await writeFile(path.join(missing, 'canon/tokens/color.json'), '{ invalid JSON')
  assert.throws(() => run(process.execPath, ['canon/build.mjs'], missing), (error) => error.status === 1)
})
