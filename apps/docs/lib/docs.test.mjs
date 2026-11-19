import assert from 'node:assert/strict'
import test from 'node:test'

import { parseDocument, readDocuments, sourceToRoute, toWebHref } from './docs.mjs'
import { getNavigationMode, getNavigationSections, groupNavigationDocuments } from './navigation.mjs'
import { searchDocuments } from './search.mjs'
import { getButtonPlaygroundModel, initialButtonPlaygroundState } from './button-playground.mjs'
import { getCheckboxPlaygroundModel, initialCheckboxPlaygroundState } from './checkbox-playground.mjs'
import { getDialogPlaygroundModel, initialDialogPlaygroundState } from './dialog-playground.mjs'
import { getRadioGroupPlaygroundModel, initialRadioGroupPlaygroundState } from './radio-group-playground.mjs'
import { getNumberFieldPlaygroundModel, initialNumberFieldPlaygroundState } from './number-field-playground.mjs'
import { getSelectPlaygroundModel, initialSelectPlaygroundState } from './select-playground.mjs'
import { getSwitchPlaygroundModel, initialSwitchPlaygroundState } from './switch-playground.mjs'
import { getTextFieldPlaygroundModel, initialTextFieldPlaygroundState } from './text-field-playground.mjs'
import { getTextAreaPlaygroundModel, initialTextAreaPlaygroundState } from './text-area-playground.mjs'

test('builds focused documentation and component navigation from authored metadata', () => {
  const documents = [
    { route: '/', title: 'Canon' },
    { route: '/docs/button', title: 'Button', navigation: 'component' },
    { route: '/docs/color', title: 'Color', navigation: 'foundation', navigationOrder: 1 },
    { route: '/docs/components', title: 'Components', navigation: 'component' },
    { route: '/docs', title: 'Docs', navigation: 'getting-started', navigationOrder: 1 },
    { route: '/docs/decisions/platform', title: 'Platform', navigation: 'architecture', navigationOrder: 1 },
    { route: '/docs/text-field', title: 'TextField', navigation: 'component' },
  ]

  assert.deepEqual(groupNavigationDocuments(documents), {
    components: [documents[3], documents[1], documents[6]],
    sections: [
      { key: 'getting-started', title: 'Getting started', documents: [documents[4]] },
      { key: 'foundation', title: 'Foundations', documents: [documents[2]] },
      { key: 'architecture', title: 'Architecture', documents: [documents[5]] },
    ],
  })

  const navigation = groupNavigationDocuments(documents)
  assert.equal(getNavigationMode(navigation, '/docs/button/'), 'components')
  assert.equal(getNavigationMode(navigation, '/docs/color'), 'docs')
  assert.equal(getNavigationMode(navigation, '/'), 'home')
  assert.deepEqual(getNavigationSections(navigation, '/docs/button/'), [
    { key: 'components', title: 'Components', documents: navigation.components },
  ])
  assert.deepEqual(getNavigationSections(navigation, '/docs/color'), navigation.sections)
  assert.deepEqual(getNavigationSections(navigation, '/'), navigation.sections)
})

test('component navigation metadata covers the complete authored component corpus', async () => {
  const componentRoutes = (await readDocuments())
    .filter((document) => document.navigation === 'component')
    .map((document) => document.route)

  assert.deepEqual(componentRoutes, [
    '/docs/button',
    '/docs/checkbox',
    '/docs/components',
    '/docs/dialog',
    '/docs/number-field',
    '/docs/radio-group',
    '/docs/select',
    '/docs/switch',
    '/docs/text-area',
    '/docs/text-field',
  ])
})

test('authored navigation metadata covers the complete left navigation corpus', async () => {
  const navigation = groupNavigationDocuments(await readDocuments())

  assert.deepEqual(
    navigation.sections.map((section) => ({
      key: section.key,
      routes: section.documents.map((document) => document.route),
    })),
    [
      { key: 'getting-started', routes: ['/docs', '/docs/guides', '/docs/workflow'] },
      { key: 'foundation', routes: ['/docs/color', '/docs/typography', '/docs/icons'] },
      {
        key: 'architecture',
        routes: ['/docs/decisions/docs-platform', '/docs/decisions/interaction-foundation', '/docs/decisions/mobile-foundation'],
      },
    ],
  )
})

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
  assert.deepEqual(model.dialogProps, { closeOnInteractOutside: true, closeOnEscape: true })
  assert.match(model.jsx, /<Dialog closeOnInteractOutside>/)
  assert.match(model.jsx, /<DialogClose aria-label="Close dialog" \/>/)
  assert.match(model.jsx, /<DialogDescription>/)
  assert.match(model.jsx, /<DialogFooter>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|ModalOverlay|slot=/)

  const reset = getDialogPlaygroundModel({
    closeOnInteractOutside: false,
    closeOnEscape: false,
    showCloseButton: false,
    showFooter: false,
  })
  assert.deepEqual(reset.dialogProps, { closeOnInteractOutside: false, closeOnEscape: false })
  assert.match(reset.jsx, /<Dialog closeOnEscape=\{false\}>/)
  assert.doesNotMatch(reset.jsx, /closeOnInteractOutside|DialogClose|DialogFooter/)
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

test('RadioGroup playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getRadioGroupPlaygroundModel(initialRadioGroupPlaygroundState)
  assert.deepEqual(model.componentProps, {
    label: 'Plan',
    name: 'plan',
    orientation: 'vertical',
    defaultValue: 'free',
    disabled: false,
    required: false,
    invalid: false,
    readOnly: false,
    description: 'Choose one plan.',
  })
  assert.match(model.jsx, /<RadioGroup label="Plan" name="plan" orientation="vertical" defaultValue="free"/)
  assert.match(model.jsx, /<RadioOption value="free">Free<\/RadioOption>/)
  assert.match(model.jsx, /<RadioOption value="team" disabled>Team<\/RadioOption>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const constrained = getRadioGroupPlaygroundModel({
    ...initialRadioGroupPlaygroundState,
    defaultValue: '',
    orientation: 'horizontal',
    disabled: true,
    required: true,
    invalid: true,
    readOnly: true,
    dark: true,
  })
  assert.equal(constrained.componentProps.defaultValue, undefined)
  assert.equal(constrained.componentProps.errorMessage, 'Choose a plan.')
  assert.match(constrained.jsx, /orientation="horizontal" disabled required invalid readOnly/)
  assert.doesNotMatch(constrained.jsx, /defaultValue=/)
  assert.equal(constrained.theme, 'dark')
})

test('NumberField playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getNumberFieldPlaygroundModel(initialNumberFieldPlaygroundState)
  assert.deepEqual(model.componentProps, {
    label: 'Budget',
    name: 'budget',
    size: 'md',
    defaultValue: 1000,
    minValue: 0,
    maxValue: 10000,
    step: 100,
    formatOptions: { style: 'currency', currency: 'USD' },
    disabled: false,
    required: false,
    invalid: false,
    readOnly: false,
    description: 'Enter the approved amount.',
  })
  assert.match(model.jsx, /<NumberField label="Budget" name="budget" size="md"/)
  assert.match(model.jsx, /defaultValue=\{1000\} minValue=\{0\} maxValue=\{10000\} step=\{100\}/)
  assert.match(model.jsx, /formatOptions=\{\{ style: 'currency', currency: 'USD' \}\}/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const constrained = getNumberFieldPlaygroundModel({
    ...initialNumberFieldPlaygroundState,
    size: 'lg',
    defaultValue: null,
    minValue: -10,
    maxValue: 10,
    step: 0.5,
    disabled: true,
    required: true,
    invalid: true,
    readOnly: true,
    dark: true,
  })
  assert.equal(constrained.componentProps.errorMessage, 'Enter a number in the allowed range.')
  assert.match(constrained.jsx, /size="lg" defaultValue=\{null\}/)
  assert.match(constrained.jsx, /minValue=\{-10\} maxValue=\{10\} step=\{0.5\}/)
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

test('TextArea playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getTextAreaPlaygroundModel(initialTextAreaPlaygroundState)
  assert.deepEqual(model.componentProps, {
    label: 'Message',
    name: 'message',
    size: 'md',
    rows: 4,
    defaultValue: '',
    placeholder: 'Write your message',
    disabled: false,
    required: false,
    invalid: false,
    readOnly: false,
    description: 'Include the details needed to help.',
  })
  assert.match(model.jsx, /<TextArea label="Message" name="message" size="md" rows=\{4\}/)
  assert.match(model.jsx, /placeholder="Write your message"/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const invalid = getTextAreaPlaygroundModel({
    ...initialTextAreaPlaygroundState,
    size: 'lg',
    rows: 8,
    disabled: true,
    required: true,
    invalid: true,
    readOnly: true,
    dark: true,
  })
  assert.equal(invalid.componentProps.errorMessage, 'Enter a message.')
  assert.match(invalid.jsx, /size="lg" rows=\{8\}/)
  assert.match(invalid.jsx, /disabled required invalid readOnly/)
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
  assert.equal(searchDocuments(documents, 'closeOnEscape focus containment')[0]?.route, '/docs/dialog')
})
