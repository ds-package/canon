import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { Checkbox } from './index'

afterEach(cleanup)

test('toggles through click and keyboard from a visible label', async () => {
  const user = userEvent.setup()
  render(<Checkbox>Accept terms</Checkbox>)
  const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })

  await user.click(checkbox)
  expect((checkbox as HTMLInputElement).checked).toBe(true)

  checkbox.focus()
  await user.keyboard(' ')
  expect((checkbox as HTMLInputElement).checked).toBe(false)
})

test('reports controlled changes without replacing product state', async () => {
  const user = userEvent.setup()
  const onCheckedChange = vi.fn()
  render(<Checkbox checked={false} onCheckedChange={onCheckedChange}>Sync changes</Checkbox>)

  const checkbox = screen.getByRole('checkbox', { name: 'Sync changes' })
  await user.click(checkbox)

  expect(onCheckedChange).toHaveBeenCalledWith(true)
  expect((checkbox as HTMLInputElement).checked).toBe(false)
})

test('exposes indeterminate state and resolves it on press', async () => {
  const user = userEvent.setup()
  const onCheckedChange = vi.fn()
  render(<Checkbox indeterminate onCheckedChange={onCheckedChange}>Select all</Checkbox>)
  const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement

  expect(checkbox.indeterminate).toBe(true)
  await user.click(checkbox)
  expect(onCheckedChange).toHaveBeenCalledWith(true)

  render(<Checkbox checked readOnly indeterminate={false}>Resolved</Checkbox>)
  const resolved = screen.getByRole('checkbox', { name: 'Resolved' }) as HTMLInputElement
  expect(resolved.indeterminate).toBe(false)
  expect(resolved.checked).toBe(true)
})

test('submits its native form value and required contract', () => {
  render(
    <form data-testid="form">
      <Checkbox name="terms" value="accepted" defaultChecked required>Accept terms</Checkbox>
    </form>,
  )

  const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' }) as HTMLInputElement
  expect(checkbox.required).toBe(true)
  expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('terms')).toBe('accepted')
})

test('associates with an external form', () => {
  render(
    <>
      <form id="settings" data-testid="external-form" />
      <Checkbox form="settings" name="updates" value="yes" defaultChecked>Updates</Checkbox>
    </>,
  )

  const form = screen.getByTestId('external-form') as HTMLFormElement
  expect(new FormData(form).get('updates')).toBe('yes')
})

test('associates description and validation error', () => {
  render(
    <Checkbox
      description="Required to continue."
      errorMessage="Accept the terms."
      invalid
    >
      Accept terms
    </Checkbox>,
  )

  const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
  const describedBy = checkbox.getAttribute('aria-describedby') ?? ''
  expect(describedBy).toContain(screen.getByText('Required to continue.').id)
  expect(describedBy).toContain(screen.getByText('Accept the terms.').id)
})

test('disabled and read-only checkboxes do not change', async () => {
  const user = userEvent.setup()
  render(
    <>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox readOnly>Read only</Checkbox>
    </>,
  )

  const disabled = screen.getByRole('checkbox', { name: 'Disabled' })
  const readOnly = screen.getByRole('checkbox', { name: 'Read only' })
  await user.click(disabled)
  await user.click(readOnly)
  readOnly.focus()
  await user.keyboard(' ')
  expect((disabled as HTMLInputElement).checked).toBe(false)
  expect((readOnly as HTMLInputElement).checked).toBe(false)
})

test('rejects inaccessible runtime input', () => {
  expect(() => render(<Checkbox>{''}</Checkbox>)).toThrow('Checkbox requires a visible label')
  expect(() => render(<Checkbox invalid>Accept terms</Checkbox>)).toThrow(
    'Checkbox requires errorMessage when invalid is true',
  )
  expect(() => render(<Checkbox checked={false as never}>Controlled</Checkbox>)).toThrow(
    'Controlled Checkbox requires onCheckedChange',
  )
  expect(() => render(
    <Checkbox checked={false as never} defaultChecked={false as never} onCheckedChange={() => {}}>
      Conflicting
    </Checkbox>,
  )).toThrow('Checkbox cannot use checked and defaultChecked together')
})
