import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { RadioGroup, RadioOption } from './index'

afterEach(cleanup)

const options = (
  <>
    <RadioOption value="email" description="Messages and product updates.">Email</RadioOption>
    <RadioOption value="push">Push</RadioOption>
    <RadioOption value="none">None</RadioOption>
  </>
)

test('selects one visible option through click and wraps with arrow keys', async () => {
  const user = userEvent.setup()
  render(<RadioGroup label="Notification channel">{options}</RadioGroup>)

  const email = screen.getByRole('radio', { name: 'Email' }) as HTMLInputElement
  const push = screen.getByRole('radio', { name: 'Push' }) as HTMLInputElement
  const none = screen.getByRole('radio', { name: 'None' }) as HTMLInputElement
  expect(screen.getByRole('radiogroup', { name: 'Notification channel' })).toBeTruthy()

  await user.click(push)
  expect(push.checked).toBe(true)
  await user.keyboard('{ArrowDown}')
  expect(none.checked).toBe(true)
  await user.keyboard('{ArrowDown}')
  expect(email.checked).toBe(true)
  await user.keyboard('{ArrowUp}')
  expect(none.checked).toBe(true)
})

test('keeps a rich label as the accessible name', () => {
  render(<RadioGroup label={<span>Notification channel</span>}>{options}</RadioGroup>)

  expect(screen.getByRole('radiogroup', { name: 'Notification channel' })).toBeTruthy()
})

test('wraps horizontal arrow navigation', async () => {
  const user = userEvent.setup()
  render(
    <RadioGroup label="Density" orientation="horizontal" defaultValue="compact">
      <RadioOption value="compact">Compact</RadioOption>
      <RadioOption value="comfortable">Comfortable</RadioOption>
    </RadioGroup>,
  )

  const compact = screen.getByRole('radio', { name: 'Compact' }) as HTMLInputElement
  const comfortable = screen.getByRole('radio', { name: 'Comfortable' }) as HTMLInputElement
  compact.focus()
  await user.keyboard('{ArrowLeft}')
  expect(comfortable.checked).toBe(true)
  await user.keyboard('{ArrowRight}')
  expect(compact.checked).toBe(true)
})

test('reports controlled changes without replacing product state', async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(
    <RadioGroup label="Plan" value="free" onValueChange={onValueChange}>
      <RadioOption value="free">Free</RadioOption>
      <RadioOption value="pro">Pro</RadioOption>
    </RadioGroup>,
  )

  await user.click(screen.getByRole('radio', { name: 'Pro' }))
  expect(onValueChange).toHaveBeenCalledWith('pro')
  expect((screen.getByRole('radio', { name: 'Free' }) as HTMLInputElement).checked).toBe(true)
})

test('submits native values to its nearest and external forms', () => {
  render(
    <>
      <form data-testid="nearest-form">
        <RadioGroup label="Plan" name="plan" defaultValue="pro">
          <RadioOption value="free">Free</RadioOption>
          <RadioOption value="pro">Pro</RadioOption>
        </RadioGroup>
      </form>
      <form id="settings" data-testid="external-form" />
      <RadioGroup label="Theme" form="settings" name="theme" defaultValue="dark">
        <RadioOption value="light">Light</RadioOption>
        <RadioOption value="dark">Dark</RadioOption>
      </RadioGroup>
    </>,
  )

  expect(new FormData(screen.getByTestId('nearest-form') as HTMLFormElement).get('plan')).toBe('pro')
  expect(new FormData(screen.getByTestId('external-form') as HTMLFormElement).get('theme')).toBe('dark')
})

test('associates group and option help text with validation errors', () => {
  render(
    <RadioGroup
      label="Plan"
      description="Choose one plan."
      errorMessage="Choose a plan to continue."
      invalid
      required
    >
      <RadioOption value="free" description="For personal projects.">Free</RadioOption>
      <RadioOption value="pro">Pro</RadioOption>
    </RadioGroup>,
  )

  const group = screen.getByRole('radiogroup', { name: 'Plan' })
  const groupDescriptions = group.getAttribute('aria-describedby') ?? ''
  expect(groupDescriptions).toContain(screen.getByText('Choose one plan.').id)
  expect(groupDescriptions).toContain(screen.getByText('Choose a plan to continue.').id)
  expect((screen.getByRole('radio', { name: 'Free' }).getAttribute('aria-describedby') ?? '')).toContain(
    screen.getByText('For personal projects.').id,
  )
  expect((screen.getByRole('radio', { name: 'Free' }) as HTMLInputElement).required).toBe(true)
})

test('group and option constraints prevent changes', async () => {
  const user = userEvent.setup()
  render(
    <>
      <RadioGroup label="Disabled group" disabled defaultValue="a">
        <RadioOption value="a">A</RadioOption>
        <RadioOption value="b">B</RadioOption>
      </RadioGroup>
      <RadioGroup label="Read only group" readOnly defaultValue="a">
        <RadioOption value="a">A</RadioOption>
        <RadioOption value="b">B</RadioOption>
      </RadioGroup>
      <RadioGroup label="Option disabled" defaultValue="a">
        <RadioOption value="a">A</RadioOption>
        <RadioOption value="b" disabled>B</RadioOption>
      </RadioGroup>
    </>,
  )

  const disabledB = screen.getAllByRole('radio', { name: 'B' })[0] as HTMLInputElement
  const readOnlyA = screen.getAllByRole('radio', { name: 'A' })[1] as HTMLInputElement
  const readOnlyB = screen.getAllByRole('radio', { name: 'B' })[1] as HTMLInputElement
  const optionA = screen.getAllByRole('radio', { name: 'A' })[2] as HTMLInputElement
  const optionDisabledB = screen.getAllByRole('radio', { name: 'B' })[2] as HTMLInputElement
  await user.click(disabledB)
  await user.click(readOnlyB)
  readOnlyA.focus()
  await user.keyboard('{ArrowDown}')
  await user.click(optionDisabledB)
  optionA.focus()
  await user.keyboard('{ArrowDown}')
  expect(disabledB.checked).toBe(false)
  expect(readOnlyB.checked).toBe(false)
  expect(optionDisabledB.checked).toBe(false)
  expect(optionA.checked).toBe(true)
})

test('rejects inaccessible and ambiguous runtime input', () => {
  expect(() => render(<RadioGroup label="">{options}</RadioGroup>)).toThrow('RadioGroup requires a visible label')
  expect(() => render(<RadioGroup label="Plan" invalid>{options}</RadioGroup>)).toThrow(
    'RadioGroup requires errorMessage when invalid is true',
  )
  expect(() => render(
    <RadioGroup label="Plan" value={'free' as never}>{options}</RadioGroup>,
  )).toThrow('Controlled RadioGroup requires onValueChange')
  expect(() => render(
    <RadioGroup
      label="Plan"
      value={'free' as never}
      defaultValue={'pro' as never}
      onValueChange={() => {}}
    >
      {options}
    </RadioGroup>,
  )).toThrow('RadioGroup cannot use value and defaultValue together')
  expect(() => render(
    <RadioGroup label="Plan"><RadioOption value="">Free</RadioOption></RadioGroup>,
  )).toThrow('RadioOption requires a non-empty string value')
  expect(() => render(
    <RadioGroup label="Plan"><RadioOption value="free">{''}</RadioOption></RadioGroup>,
  )).toThrow('RadioOption requires a visible label')
  expect(() => render(
    <RadioGroup label="Plan">
      <RadioOption value="free">Free</RadioOption>
      <RadioOption value="free">Free again</RadioOption>
    </RadioGroup>,
  )).toThrow('RadioGroup option values must be unique')
  expect(() => render(
    <RadioGroup label="Plan">{<div>Not a radio option</div> as never}</RadioGroup>,
  )).toThrow('RadioGroup children must be RadioOption elements')
  expect(() => render(
    <RadioGroup label="Plan">{[] as never}</RadioGroup>,
  )).toThrow('RadioGroup requires at least one RadioOption')
})
