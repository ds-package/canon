import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { TextArea } from './index'

afterEach(cleanup)

test('accepts multiple lines through a visible label', async () => {
  const user = userEvent.setup()
  render(<TextArea label="Comment" rows={4} />)

  const input = screen.getByRole('textbox', { name: 'Comment' }) as HTMLTextAreaElement
  await user.type(input, 'First line{enter}Second line')

  expect(input.value).toBe('First line\nSecond line')
  expect(input.rows).toBe(4)
})

test('reports controlled edits without replacing product state', async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(<TextArea label="Bio" value="Lou" onValueChange={onValueChange} />)

  const input = screen.getByRole('textbox', { name: 'Bio' }) as HTMLTextAreaElement
  await user.type(input, 'ise')

  expect(onValueChange).toHaveBeenCalled()
  expect(input.value).toBe('Lou')
})

test('submits values to its nearest and external forms', () => {
  render(
    <>
      <form data-testid="nearest-form">
        <TextArea label="Comment" name="comment" defaultValue="Hello" required />
      </form>
      <form id="profile" data-testid="external-form" />
      <TextArea form="profile" label="Bio" name="bio" defaultValue="Designer" />
    </>,
  )

  const comment = screen.getByRole('textbox', { name: 'Comment' }) as HTMLTextAreaElement
  expect(comment.required).toBe(true)
  expect(new FormData(screen.getByTestId('nearest-form') as HTMLFormElement).get('comment')).toBe('Hello')
  expect(new FormData(screen.getByTestId('external-form') as HTMLFormElement).get('bio')).toBe('Designer')
})

test('distinguishes disabled fields from read-only submitted values', async () => {
  const user = userEvent.setup()
  render(
    <form data-testid="form">
      <TextArea label="Disabled" name="disabled" defaultValue="blocked" disabled />
      <TextArea label="Read only" name="readonly" defaultValue="kept" readOnly />
    </form>,
  )

  const disabled = screen.getByRole('textbox', { name: 'Disabled' }) as HTMLTextAreaElement
  const readOnly = screen.getByRole('textbox', { name: 'Read only' }) as HTMLTextAreaElement
  await user.type(disabled, 'changed')
  await user.type(readOnly, 'changed')

  const data = new FormData(screen.getByTestId('form') as HTMLFormElement)
  expect(disabled.disabled).toBe(true)
  expect(readOnly.readOnly).toBe(true)
  expect(data.has('disabled')).toBe(false)
  expect(data.get('readonly')).toBe('kept')
})

test('associates description and validation error with the textarea', () => {
  render(
    <TextArea
      label="Feedback"
      description="Tell us what happened."
      errorMessage="Feedback is required."
      invalid
    />,
  )

  const input = screen.getByRole('textbox', { name: 'Feedback' })
  const describedBy = input.getAttribute('aria-describedby') ?? ''
  expect(describedBy).toContain(screen.getByText('Tell us what happened.').id)
  expect(describedBy).toContain(screen.getByText('Feedback is required.').id)
})

test('exposes every documented size through the DOM contract', () => {
  for (const size of ['sm', 'md', 'lg'] as const) {
    const { unmount } = render(<TextArea label={size} size={size} />)
    expect(screen.getByRole('textbox', { name: size }).getAttribute('data-size')).toBe(size)
    unmount()
  }
})

test('rejects inaccessible or ambiguous runtime input', () => {
  expect(() => render(<TextArea label="" />)).toThrow('TextArea requires a visible label')
  expect(() => render(<TextArea label="Feedback" invalid />)).toThrow(
    'TextArea requires errorMessage when invalid is true',
  )
  expect(() => render(<TextArea label="Feedback" rows={0} />)).toThrow(
    'TextArea rows must be a positive integer',
  )
  expect(() => render(<TextArea label="Feedback" value={'' as never} />)).toThrow(
    'Controlled TextArea requires onValueChange',
  )
  expect(() => render(
    <TextArea
      label="Feedback"
      value={'a' as never}
      defaultValue={'b' as never}
      onValueChange={() => {}}
    />,
  )).toThrow('TextArea cannot use value and defaultValue together')
})
