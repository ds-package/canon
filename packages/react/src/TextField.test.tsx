import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { TextField } from './index'

afterEach(cleanup)

test('accepts text through a visibly labelled input', async () => {
  const user = userEvent.setup()
  render(<TextField label="Email" type="email" />)

  const input = screen.getByRole('textbox', { name: 'Email' })
  await user.type(input, 'lou@example.com')

  expect((input as HTMLInputElement).value).toBe('lou@example.com')
  expect(input.getAttribute('type')).toBe('email')
})

test('reports controlled edits without replacing product state', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<TextField label="Name" value="Lou" onChange={onChange} />)

  const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement
  await user.type(input, 'ise')

  expect(onChange).toHaveBeenCalled()
  expect(input.value).toBe('Lou')
})

test('submits native field attributes and its value', () => {
  render(
    <form data-testid="form">
      <TextField
        label="Email"
        name="email"
        type="email"
        defaultValue="lou@example.com"
        autoComplete="email"
        required
      />
    </form>,
  )

  const form = screen.getByTestId('form') as HTMLFormElement
  const input = screen.getByRole('textbox', { name: 'Email' }) as HTMLInputElement
  expect(input.required).toBe(true)
  expect(input.autocomplete).toBe('email')
  expect(new FormData(form).get('email')).toBe('lou@example.com')
})

test('distinguishes disabled fields from read-only submitted values', async () => {
  const user = userEvent.setup()
  render(
    <form data-testid="form">
      <TextField label="Disabled" name="disabled" defaultValue="blocked" disabled />
      <TextField label="Read only" name="readonly" defaultValue="kept" readOnly />
    </form>,
  )

  const disabled = screen.getByRole('textbox', { name: 'Disabled' }) as HTMLInputElement
  const readOnly = screen.getByRole('textbox', { name: 'Read only' }) as HTMLInputElement
  await user.type(disabled, 'changed')
  await user.type(readOnly, 'changed')

  const data = new FormData(screen.getByTestId('form') as HTMLFormElement)
  expect(disabled.disabled).toBe(true)
  expect(readOnly.readOnly).toBe(true)
  expect(data.has('disabled')).toBe(false)
  expect(data.get('readonly')).toBe('kept')
})

test('associates description and validation error with the input', () => {
  render(
    <TextField
      label="Password"
      description="Use at least 12 characters."
      errorMessage="Password is too short."
      invalid
    />,
  )

  const input = screen.getByLabelText('Password')
  const describedBy = input.getAttribute('aria-describedby') ?? ''
  expect(describedBy).toContain(screen.getByText('Use at least 12 characters.').id)
  expect(describedBy).toContain(screen.getByText('Password is too short.').id)
})

test('exposes every documented size through the DOM contract', () => {
  for (const size of ['sm', 'md', 'lg'] as const) {
    const { unmount } = render(<TextField label={size} size={size} />)
    expect(screen.getByLabelText(size).getAttribute('data-size')).toBe(size)
    unmount()
  }
})

test('rejects inaccessible or unsupported runtime input', () => {
  expect(() => render(<TextField label="" />)).toThrow('TextField requires a visible label')
  expect(() => render(<TextField label="Email" invalid />)).toThrow(
    'TextField requires errorMessage when invalid is true',
  )
  expect(() => render(<TextField label="Amount" type={'number' as never} />)).toThrow(
    'TextField does not support type="number"',
  )
})
