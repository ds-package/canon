import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' })

test('packed packages work from a consumer project', async (t) => {
  const workDir = await mkdtemp(path.join(tmpdir(), 'canon-consumer-'))
  t.after(() => rm(workDir, { recursive: true, force: true }))
  const packDir = path.join(workDir, 'packs')
  const consumerDir = path.join(workDir, 'consumer')

  await mkdir(packDir)
  await mkdir(consumerDir)
  run('pnpm', ['--filter', '@canon/tokens', 'pack', '--pack-destination', packDir], repoRoot)
  run('pnpm', ['--filter', '@canon/cli', 'pack', '--pack-destination', packDir], repoRoot)

  const archives = await readdir(packDir)
  const tokenArchiveName = archives.find((name) => name.startsWith('canon-tokens-'))
  const cliArchiveName = archives.find((name) => name.startsWith('canon-cli-'))
  assert.ok(tokenArchiveName)
  assert.ok(cliArchiveName)
  const tokenArchive = path.join(packDir, tokenArchiveName)
  const cliArchive = path.join(packDir, cliArchiveName)

  await writeFile(
    path.join(consumerDir, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      dependencies: {
        '@canon/cli': `file:${cliArchive}`,
        '@canon/tokens': `file:${tokenArchive}`,
      },
    }),
  )
  run('pnpm', ['install', '--ignore-scripts'], consumerDir)

  assert.equal(
    run(
      'node',
      ['--input-type=module', '-e', "import { tokens } from '@canon/tokens'; process.stdout.write(tokens.semantic.status.informative)"],
      consumerDir,
    ),
    'var(--semantic-status-informative)',
  )
  assert.equal(
    run('node', ['-e', "process.stdout.write(require('@canon/tokens').tokens.semantic.status.informative)"], consumerDir),
    'var(--semantic-status-informative)',
  )

  const cssPath = run(
    'node',
    ['--input-type=module', '-e', "import { createRequire } from 'node:module'; process.stdout.write(createRequire(import.meta.url).resolve('@canon/tokens/css'))"],
    consumerDir,
  )
  assert.match(await readFile(cssPath, 'utf8'), /--semantic-status-informative:/)

  run('pnpm', ['exec', 'canon', 'eject'], consumerDir)
  const ejectedTokens = await readdir(path.join(consumerDir, 'canon/tokens'))
  assert.deepEqual(ejectedTokens.sort(), [
    'brand.json',
    'color.json',
    'semantic.json',
    'shadow.json',
    'shape.json',
    'spacing.json',
    'tint.json',
    'typography.json',
  ])
  assert.match(await readFile(path.join(consumerDir, 'canon/tokens/semantic.json'), 'utf8'), /"status-informative"/)
  assert.match(await readFile(path.join(consumerDir, 'style-dictionary.config.json'), 'utf8'), /canon\/tokens\/\*\*\/\*\.json/)
})
