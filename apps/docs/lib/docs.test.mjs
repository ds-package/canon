import assert from 'node:assert/strict'
import test from 'node:test'

import { parseDocument, readDocuments, sourceToRoute, toWebHref } from './docs.mjs'
import { searchDocuments } from './search.mjs'
import { getButtonPlaygroundModel, initialButtonPlaygroundState } from './button-playground.mjs'
import { getCheckboxPlaygroundModel, initialCheckboxPlaygroundState } from './checkbox-playground.mjs'
import { getDialogPlaygroundModel, initialDialogPlaygroundState } from './dialog-playground.mjs'
import { getSelectPlaygroundModel, initialSelectPlaygroundState } from './select-playground.mjs'
import { getSwitchPlaygroundModel, initialSwitchPlaygroundState } from './switch-playground.mjs'
import { getTextFieldPlaygroundModel, initialTextFieldPlaygroundState } from './text-field-playground.mjs'

test('maps authored source paths and relative Markdown links to stable web routes', () => {
  assert.equal(sourceToRoute('DESIGN.md'), '/')
  assert.equal(sourceToRoute('docs/README.md'), '/docs')
  assert.equal(sourceToRoute('docs/guides/README.md'), '/docs/guides')
  assert.equal(sourceToRoute('docs/color.md'), '/docs/color')
  assert.equal(toWebHref('./typography.md#roles', 'docs/color.md'), '/docs/typography#roles')
  assert.equal(toWebHref('../DESIGN.md', 'docs/README.md'), '/')
  assert.equal(toWebHref('./tools/ramps.py', 'docs/color.md'), 'https://github.com/ds-package/canon/blob/main/docs/tools/ramps.py')
  assert.equal(toWebHref('./tools/figma-plugins/type-styles', 'docs/typography.md'), 'https://github.com/ds-package/canon/tree/main/docs/tools/figma-plugins/type-styles')
  assert.equal(toWebHref('https://react-aria.adobe.com/', 'docs/README.md'), 'https://react-aria.adobe.com/')
})

test('Dialog playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getDialogPlaygroundModel(initialDialogPlaygroundState)
  assert.deepEqual(model.dialogProps, { dismissable: true })
  assert.match(model.jsx, /<Dialog dismissable>/)
  assert.match(model.jsx, /<DialogClose aria-label="Close dialog" \/>/)
  assert.match(model.jsx, /<DialogDescription>/)
  assert.match(model.jsx, /<DialogFooter>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|ModalOverlay|slot=/)

  const reset = getDialogPlaygroundModel({
    dismissable: false,
    showCloseButton: false,
    showFooter: false,
  })
  assert.deepEqual(reset.dialogProps, { dismissable: false })
  assert.doesNotMatch(reset.jsx, /dismissable|DialogClose|DialogFooter/)
})

test('Button playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getButtonPlaygroundModel(initialButtonPlaygroundState)
  assert.deepEqual(model.componentProps, {
    variant: 'primary',
    size: 'md',
    disabled: false,
    pending: false,
  })
  assert.equal(model.component, 'Button')
  assert.match(model.jsx, /<Button variant="primary" size="md">Save changes<\/Button>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const icon = getButtonPlaygroundModel({
    ...initialButtonPlaygroundState,
    component: 'icon',
    variant: 'quiet',
    size: 'xs',
    disabled: true,
    pending: true,
    shape: 'round',
    dark: true,
  })
  assert.equal(icon.component, 'IconButton')
  assert.deepEqual(icon.componentProps, {
    variant: 'quiet',
    size: 'xs',
    disabled: true,
    pending: true,
    shape: 'round',
    'aria-label': 'Close',
  })
  assert.match(icon.jsx, /<IconButton/)
  assert.match(icon.jsx, /icon=\{<XIcon \/>\}/)
  assert.match(icon.jsx, /aria-label="Close"/)
  assert.match(icon.jsx, /disabled/)
  assert.match(icon.jsx, /pending/)
  assert.equal(icon.theme, 'dark')
})

test('Checkbox playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getCheckboxPlaygroundModel(initialCheckboxPlaygroundState)
  assert.deepEqual(model.componentProps, {
    name: 'terms',
    value: 'accepted',
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    invalid: false,
    readOnly: false,
    description: 'Confirm before continuing.',
  })
  assert.match(model.jsx, /<Checkbox name="terms" value="accepted"/)
  assert.match(model.jsx, />Accept the terms<\/Checkbox>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const constrained = getCheckboxPlaygroundModel({
    ...initialCheckboxPlaygroundState,
    defaultChecked: true,
    indeterminate: true,
    disabled: true,
    required: true,
    invalid: true,
    readOnly: true,
    dark: true,
  })
  assert.equal(constrained.componentProps.errorMessage, 'Accept the terms to continue.')
  assert.equal(constrained.componentProps.defaultChecked, false)
  assert.match(constrained.jsx, /const \[checked, setChecked\] = useState\(false\)/)
  assert.match(constrained.jsx, /checked=\{checked\} indeterminate=\{indeterminate\}/)
  assert.match(constrained.jsx, /setIndeterminate\(false\)/)
  assert.match(constrained.jsx, /disabled required invalid readOnly/)
  assert.equal(constrained.theme, 'dark')
})

test('Select playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getSelectPlaygroundModel(initialSelectPlaygroundState)
  assert.deepEqual(model.componentProps, {
    label: 'Fruit',
    name: 'fruit',
    size: 'md',
    disabled: false,
    required: false,
    invalid: false,
    description: 'Choose one fruit.',
    defaultValue: 'apple',
  })
  assert.match(model.jsx, /<Select label="Fruit" name="fruit" size="md" defaultValue="apple"/)
  assert.match(model.jsx, /<SelectItem id="apple">Apple<\/SelectItem>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const invalid = getSelectPlaygroundModel({
    ...initialSelectPlaygroundState,
    defaultValue: '',
    size: 'lg',
    disabled: true,
    required: true,
    invalid: true,
    dark: true,
  })
  assert.equal(invalid.componentProps.defaultValue, undefined)
  assert.equal(invalid.componentProps.errorMessage, 'Choose a valid fruit.')
  assert.match(invalid.jsx, /size="lg" disabled required invalid/)
  assert.doesNotMatch(invalid.jsx, /defaultValue/)
  assert.equal(invalid.theme, 'dark')
})

test('Switch playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getSwitchPlaygroundModel(initialSwitchPlaygroundState)
  assert.deepEqual(model.componentProps, {
    name: 'notifications',
    value: 'enabled',
    defaultChecked: false,
    disabled: false,
    readOnly: false,
    description: 'Applies immediately.',
  })
  assert.match(model.jsx, /<Switch name="notifications" value="enabled"/)
  assert.match(model.jsx, /onCheckedChange=\{\(checked\) => updateNotificationSettings\(checked\)\}/)
  assert.match(model.jsx, />Notifications<\/Switch>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const constrained = getSwitchPlaygroundModel({
    ...initialSwitchPlaygroundState,
    defaultChecked: true,
    disabled: true,
    readOnly: true,
    dark: true,
  })
  assert.match(constrained.jsx, /defaultChecked disabled readOnly/)
  assert.doesNotMatch(constrained.jsx, /updateNotificationSettings/)
  assert.equal(constrained.theme, 'dark')
})

test('TextField playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getTextFieldPlaygroundModel(initialTextFieldPlaygroundState)
  assert.deepEqual(model.componentProps, {
    label: 'Email',
    name: 'email',
    type: 'email',
    size: 'md',
    defaultValue: 'lou@example.com',
    disabled: false,
    required: false,
    invalid: false,
    readOnly: false,
    description: 'We only use this for account updates.',
  })
  assert.match(model.jsx, /<TextField label="Email" name="email" type="email" size="md"/)
  assert.match(model.jsx, /defaultValue="lou@example.com"/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const invalid = getTextFieldPlaygroundModel({
    ...initialTextFieldPlaygroundState,
    type: 'password',
    size: 'lg',
    defaultValue: '',
    disabled: true,
    required: true,
    invalid: true,
    readOnly: true,
    dark: true,
  })
  assert.equal(invalid.componentProps.defaultValue, undefined)
  assert.equal(invalid.componentProps.errorMessage, 'Enter a valid value.')
  assert.match(invalid.jsx, /type="password" size="lg" disabled required invalid readOnly/)
  assert.doesNotMatch(invalid.jsx, /defaultValue=/)
  assert.equal(invalid.theme, 'dark')
})

test('extracts the document index fields without creating another prose source', () => {
  const document = parseDocument('docs/example.md', '---\nverified: 2026-11-01\n---\n# Example\n\n## Details\n\nUse **tokens**.')
  assert.deepEqual(document.headings, ['Example', 'Details'])
  assert.equal(document.title, 'Example')
  assert.equal(document.body, 'Example Details Use tokens.')
})

test('indexes every Canon source and ranks title, headings, then body matches', async () => {
  const documents = await readDocuments()
  assert.ok(documents.some((document) => document.route === '/'))
  assert.ok(documents.some((document) => document.route === '/docs'))

  const fixtures = [
    { title: 'Body match', headings: [], body: 'React Aria를 사용한다.', route: '/body' },
    { title: 'Heading match', headings: ['React Aria'], body: '', route: '/heading' },
    { title: 'React Aria', headings: [], body: '', route: '/title' },
  ]
  assert.deepEqual(searchDocuments(fixtures, 'React Aria').map(({ route }) => route), ['/title', '/heading', '/body'])
  assert.equal(searchDocuments(documents, 'React Aria Components 책임 경계')[0]?.route, '/docs/decisions/interaction-foundation')
  assert.equal(searchDocuments(documents, 'keyboardDismissDisabled')[0]?.route, '/docs/dialog')
})
