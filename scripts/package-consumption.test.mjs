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
  run('pnpm', ['--filter', '@canon/react', 'pack', '--pack-destination', packDir], repoRoot)

  const archives = await readdir(packDir)
  const tokenArchiveName = archives.find((name) => name.startsWith('canon-tokens-'))
  const cliArchiveName = archives.find((name) => name.startsWith('canon-cli-'))
  const reactArchiveName = archives.find((name) => name.startsWith('canon-react-'))
  assert.ok(tokenArchiveName)
  assert.ok(cliArchiveName)
  assert.ok(reactArchiveName)
  const tokenArchive = path.join(packDir, tokenArchiveName)
  const cliArchive = path.join(packDir, cliArchiveName)
  const reactArchive = path.join(packDir, reactArchiveName)

  await writeFile(
    path.join(consumerDir, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      dependencies: {
        '@canon/cli': `file:${cliArchive}`,
        '@canon/react': `file:${reactArchive}`,
        '@canon/tokens': `file:${tokenArchive}`,
        react: '19.3.1',
        'style-dictionary': '^4.1.4',
        'react-dom': '19.3.1',
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

  assert.equal(
    run('node', ['--input-type=module', '-e', "import { Button, Checkbox, Dialog, RadioGroup, RadioOption, Select, Switch, TextField } from '@canon/react'; process.stdout.write(`${Button.name},${Checkbox.name},${Dialog.name},${RadioGroup.name},${RadioOption.name},${Select.name},${Switch.name},${TextField.name}`)"], consumerDir),
    'Button,Checkbox,Dialog,RadioGroup,RadioOption,Select,Switch,TextField',
  )
  assert.equal(
    run('node', ['-e', "const { Button, Checkbox, Dialog, RadioGroup, RadioOption, Select, Switch, TextField } = require('@canon/react'); process.stdout.write(`${Button.name},${Checkbox.name},${Dialog.name},${RadioGroup.name},${RadioOption.name},${Select.name},${Switch.name},${TextField.name}`)"], consumerDir),
    'Button,Checkbox,Dialog,RadioGroup,RadioOption,Select,Switch,TextField',
  )

  const renderedButton = run(
    'node',
    [
      '--input-type=module',
      '-e',
      "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Button } from '@canon/react'; process.stdout.write(renderToString(React.createElement(Button, null, 'Save')));",
    ],
    consumerDir,
  )
  assert.match(renderedButton, /class="canon-button"/)
  assert.match(renderedButton, /data-variant="primary"/)

  const renderedDialog = run(
    'node',
    [
      '--input-type=module',
      '-e',
      "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Dialog, DialogDescription, DialogTitle, DialogTrigger } from '@canon/react'; process.stdout.write(renderToString(React.createElement(DialogTrigger, null, React.createElement('button', null, 'Open'), React.createElement(Dialog, null, React.createElement(DialogTitle, null, 'Title'), React.createElement(DialogDescription, null, 'Description')))));",
    ],
    consumerDir,
  )
  assert.match(renderedDialog, />Open<\/button>/)

  const renderedSelect = run(
    'node',
    [
      '--input-type=module',
      '-e',
      "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Select, SelectItem } from '@canon/react'; process.stdout.write(renderToString(React.createElement(Select, {label: 'Fruit', name: 'fruit', defaultValue: 'apple'}, React.createElement(SelectItem, {id: 'apple'}, 'Apple'))));",
    ],
    consumerDir,
  )
  assert.match(renderedSelect, /class="canon-select"/)
  assert.match(renderedSelect, /value="apple"/)

  const renderedTextField = run(
    'node',
    [
      '--input-type=module',
      '-e',
      "import React from 'react'; import { renderToString } from 'react-dom/server'; import { TextField } from '@canon/react'; process.stdout.write(renderToString(React.createElement(TextField, {label: 'Email', name: 'email', type: 'email', defaultValue: 'lou@example.com'})));",
    ],
    consumerDir,
  )
  assert.match(renderedTextField, /class="canon-text-field"/)
  assert.match(renderedTextField, /value="lou@example.com"/)

  const renderedCheckbox = run(
    'node',
    [
      '--input-type=module',
      '-e',
      "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Checkbox } from '@canon/react'; process.stdout.write(renderToString(React.createElement(Checkbox, {form: 'settings', name: 'terms', value: 'accepted', defaultChecked: true}, 'Accept terms')));",
    ],
    consumerDir,
  )
  assert.match(renderedCheckbox, /class="canon-checkbox"/)
  assert.match(renderedCheckbox, /name="terms"/)
  assert.match(renderedCheckbox, /value="accepted"/)
  assert.match(renderedCheckbox, /form="settings"/)
  assert.match(renderedCheckbox, /checked=""/)

  const renderedSwitch = run(
    'node',
    [
      '--input-type=module',
      '-e',
      "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Switch } from '@canon/react'; process.stdout.write(renderToString(React.createElement(Switch, {form: 'settings', name: 'motion', value: 'reduced', defaultChecked: true}, 'Reduce motion')));",
    ],
    consumerDir,
  )
  assert.match(renderedSwitch, /class="canon-switch"/)
  assert.match(renderedSwitch, /name="motion"/)
  assert.match(renderedSwitch, /value="reduced"/)
  assert.match(renderedSwitch, /form="settings"/)
  assert.match(renderedSwitch, /role="switch"/)
  assert.match(renderedSwitch, /checked=""/)

  const renderedRadioGroup = run(
    'node',
    [
      '--input-type=module',
      '-e',
      "import React from 'react'; import { renderToString } from 'react-dom/server'; import { RadioGroup, RadioOption } from '@canon/react'; process.stdout.write(renderToString(React.createElement(RadioGroup, {label: 'Plan', form: 'settings', name: 'plan', defaultValue: 'pro'}, React.createElement(RadioOption, {value: 'free'}, 'Free'), React.createElement(RadioOption, {value: 'pro'}, 'Pro'))));",
    ],
    consumerDir,
  )
  assert.match(renderedRadioGroup, /class="canon-radio-group"/)
  assert.match(renderedRadioGroup, /name="plan"/)
  assert.match(renderedRadioGroup, /value="pro"/)
  assert.match(renderedRadioGroup, /form="settings"/)
  assert.match(renderedRadioGroup, /checked=""/)

  const cssPath = run(
    'node',
    ['--input-type=module', '-e', "import { createRequire } from 'node:module'; process.stdout.write(createRequire(import.meta.url).resolve('@canon/tokens/css'))"],
    consumerDir,
  )
  assert.match(await readFile(cssPath, 'utf8'), /--semantic-status-informative:/)

  const reactCssPath = run(
    'node',
    ['--input-type=module', '-e', "import { createRequire } from 'node:module'; process.stdout.write(createRequire(import.meta.url).resolve('@canon/react/styles.css'))"],
    consumerDir,
  )
  assert.match(await readFile(reactCssPath, 'utf8'), /--semantic-overlay-scrim/)
  const reactCss = await readFile(reactCssPath, 'utf8')
  for (const variant of ['primary', 'secondary', 'quiet', 'destructive']) {
    assert.match(reactCss, new RegExp(`\\.canon-button\\[data-variant="${variant}"\\]`))
  }
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    assert.match(reactCss, new RegExp(`\\.canon-button\\[data-size="${size}"\\]`))
  }
  for (const selector of ['canon-select-trigger', 'canon-select-popover', 'canon-select-item']) {
    assert.match(reactCss, new RegExp(`\\.${selector}`))
  }
  for (const size of ['sm', 'md', 'lg']) {
    assert.match(reactCss, new RegExp(`\\.canon-text-field-input\\[data-size="${size}"\\]`))
  }
  assert.match(reactCss, /\.canon-text-field\[data-disabled\] \.canon-text-field-input::placeholder/)
  assert.match(reactCss, /\.canon-checkbox-control/)
  assert.match(reactCss, /\.canon-switch-control/)
  assert.match(reactCss, /\.canon-radio-option-control/)

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
  run('node', ['canon/build.mjs'], consumerDir)
  assert.equal(await readFile(path.join(consumerDir, 'src/styles/canon-variables.css'), 'utf8'), await readFile(cssPath, 'utf8'))
})
