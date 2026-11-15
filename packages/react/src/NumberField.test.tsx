import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { NumberField } from './NumberField'

afterEach(cleanup)

test('edits a visibly labelled number with keyboard and stepper buttons', async () => {
  const user = userEvent.setup()
  render(<NumberField label="Quantity" defaultValue={2} minValue={0} maxValue={3} />)

  const input = screen.getByRole('textbox', { name: 'Quantity' }) as HTMLInputElement
  expect(input.getAttribute('aria-roledescription')).toBe('Number field')

  input.focus()
  await user.keyboard('{ArrowUp}')
  expect(input.value).toBe('3')
  await user.click(screen.getByRole('button', { name: /decrease/i }))
  expect(input.value).toBe('2')
})

test('keeps a rich label as the accessible name', () => {
  render(<NumberField label={<span>Guest count</span>} />)

  expect(screen.getByRole('textbox', { name: 'Guest count' })).toBeTruthy()
})

test('normalizes an empty controlled edit to null without owning product state', async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(<NumberField label="Guests" value={1} onValueChange={onValueChange} />)

  const input = screen.getByRole('textbox', { name: 'Guests' }) as HTMLInputElement
  await user.click(input)
  await user.keyboard('{Meta>}a{/Meta}{Backspace}{Tab}')
  expect(onValueChange).toHaveBeenLastCalledWith(null)
  expect(input.value).toBe('1')

  render(<NumberField label="Optional guests" value={null} readOnly />)
  expect((screen.getByRole('textbox', { name: 'Optional guests' }) as HTMLInputElement).value).toBe('')
})

test('snaps a typed decimal to the configured step on blur', async () => {
  const user = userEvent.setup()
  render(<NumberField label="Quantity" defaultValue={1} step={1} />)

  const input = screen.getByRole('textbox', { name: 'Quantity' }) as HTMLInputElement
  await user.clear(input)
  await user.type(input, '2.7')
  await user.tab()
  expect(input.value).toBe('3')
})

test('snaps a controlled value for display and raw form submission', () => {
  render(
    <form data-testid="controlled-form">
      <NumberField label="Quantity" name="quantity" value={2.7} step={1} readOnly />
    </form>,
  )

  expect((screen.getByRole('textbox', { name: 'Quantity' }) as HTMLInputElement).value).toBe('3')
  expect(new FormData(screen.getByTestId('controlled-form') as HTMLFormElement).get('quantity')).toBe('3')
})

test('formats the visible value but submits a raw number to nearest and external forms', () => {
  render(
    <>
      <form data-testid="nearest-form">
        <NumberField
          label="Price"
          name="price"
          defaultValue={1234}
          formatOptions={{ style: 'currency', currency: 'USD' }}
          required
        />
      </form>
      <form id="order" data-testid="external-form" />
      <NumberField form="order" label="Quantity" name="quantity" defaultValue={2} />
    </>,
  )

  const price = screen.getByRole('textbox', { name: 'Price' }) as HTMLInputElement
  expect(price.value).toContain('$')
  expect(price.required).toBe(true)
  expect(new FormData(screen.getByTestId('nearest-form') as HTMLFormElement).get('price')).toBe('1234')
  expect(new FormData(screen.getByTestId('external-form') as HTMLFormElement).get('quantity')).toBe('2')
})

test('disables steppers at bounds and prevents disabled or read-only edits', async () => {
  const user = userEvent.setup()
  render(
    <>
      <NumberField label="Bounded" defaultValue={0} minValue={0} maxValue={1} />
      <NumberField label="Disabled" defaultValue={1} disabled />
      <NumberField label="Read only" value={1} readOnly />
    </>,
  )

  const bounded = screen.getByRole('textbox', { name: 'Bounded' }) as HTMLInputElement
  const decrement = screen.getAllByRole('button', { name: /decrease/i })[0]
  const increment = screen.getAllByRole('button', { name: /increase/i })[0]
  expect((decrement as HTMLButtonElement).disabled).toBe(true)
  await user.click(increment)
  expect(bounded.value).toBe('1')
  expect((increment as HTMLButtonElement).disabled).toBe(true)

  const disabled = screen.getByRole('textbox', { name: 'Disabled' }) as HTMLInputElement
  const readOnly = screen.getByRole('textbox', { name: 'Read only' }) as HTMLInputElement
  await user.type(disabled, '2')
  readOnly.focus()
  await user.keyboard('{ArrowUp}')
  expect(disabled.value).toBe('1')
  expect(readOnly.value).toBe('1')
})

test('associates description and validation error with the input', () => {
  render(
    <NumberField
      label="Quantity"
      description="Choose between one and ten."
      errorMessage="Quantity is out of range."
      invalid
    />,
  )

  const input = screen.getByRole('textbox', { name: 'Quantity' })
  const describedBy = input.getAttribute('aria-describedby') ?? ''
  expect(describedBy).toContain(screen.getByText('Choose between one and ten.').id)
  expect(describedBy).toContain(screen.getByText('Quantity is out of range.').id)
})

test('rejects inaccessible or ambiguous runtime input', () => {
  expect(() => render(<NumberField label="" />)).toThrow('NumberField requires a visible label')
  expect(() => render(<NumberField label="Quantity" invalid />)).toThrow(
    'NumberField requires errorMessage when invalid is true',
  )
  expect(() => render(<NumberField label="Quantity" step={0} />)).toThrow(
    'NumberField step must be a positive finite number',
  )
  expect(() => render(<NumberField label="Quantity" minValue={2} maxValue={1} />)).toThrow(
    'NumberField minValue cannot exceed maxValue',
  )
  expect(() => render(<NumberField label="Quantity" value={1 as never} />)).toThrow(
    'Controlled NumberField requires onValueChange',
  )
  expect(() => render(
    <NumberField label="Quantity" value={1 as never} defaultValue={2 as never} onValueChange={() => {}} />,
  )).toThrow('NumberField cannot use value and defaultValue together')
  expect(() => render(<NumberField label="Quantity" defaultValue={Number.POSITIVE_INFINITY} />)).toThrow(
    'NumberField values must be finite numbers or null',
  )
  expect(() => render(<NumberField label="Quantity" minValue={null as never} />)).toThrow(
    'NumberField bounds must be finite numbers',
  )
})
