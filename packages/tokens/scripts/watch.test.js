import assert from 'node:assert/strict'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const packageRoot = fileURLToPath(new URL('../', import.meta.url))

test('dev rebuilds CSS and Tailwind after JSON edits and JS/types after TypeScript edits', { timeout: 30000 }, async (t) => {
  const sandbox = await mkdtemp(path.join(tmpdir(), 'canon-watch-'))
  const temp = path.join(sandbox, 'packages/tokens')
  await mkdir(temp, { recursive: true })
  await cp(path.join(packageRoot, '../../tsconfig.base.json'), path.join(sandbox, 'tsconfig.base.json'))
  for (const entry of ['tokens', 'src', 'scripts', 'package.json', 'tsup.config.ts', 'tsconfig.json']) {
    await cp(path.join(packageRoot, entry), path.join(temp, entry), { recursive: true })
  }
  await symlink(path.join(packageRoot, 'node_modules'), path.join(temp, 'node_modules'))
  const child = spawn('pnpm', ['dev'], { cwd: temp, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk })
  child.stderr.on('data', (chunk) => { output += chunk })
  t.after(async () => {
    if (child.exitCode === null) {
      const exited = new Promise((resolve) => child.once('exit', resolve))
      process.kill(-child.pid, 'SIGTERM')
      await exited
    }
    await rm(sandbox, { recursive: true, force: true, maxRetries: 3 })
  })

  const waitFor = async (relative, pattern) => {
    const deadline = Date.now() + 10000
    while (Date.now() < deadline) {
      try {
        if (pattern.test(await readFile(path.join(temp, relative), 'utf8'))) return
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
      assert.equal(child.exitCode, null, `dev exited before rebuilding ${relative}\n${output}`)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    assert.fail(`dev did not rebuild ${relative}\n${output}`)
  }

  await waitFor('dist/css/variables.css', /--spacing-4: 16px;/)
  await waitFor('dist/index.mjs', /semantic-text-primary/)
  const spacingPath = path.join(temp, 'tokens/spacing.json')
  const spacing = JSON.parse(await readFile(spacingPath, 'utf8'))
  spacing.spacing.watchTest = { $type: 'dimension', $value: '123px' }
  await writeFile(spacingPath, JSON.stringify(spacing))
  await waitFor('dist/css/variables.css', /--spacing-watch-test: 123px;/)
  await waitFor('dist/tailwind/preset.js', /var\(--spacing-watch-test\)/)

  const sourcePath = path.join(temp, 'src/index.ts')
  await writeFile(sourcePath, `${await readFile(sourcePath, 'utf8')}\nexport const watchTest = 'updated' as const\n`)
  await waitFor('dist/index.mjs', /watchTest/)
  await waitFor('dist/index.cjs', /watchTest/)
  await waitFor('dist/index.d.ts', /watchTest/)
  await waitFor('dist/index.d.cts', /watchTest/)
})
