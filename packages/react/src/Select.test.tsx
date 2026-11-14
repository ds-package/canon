import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { Select, SelectItem } from './index'

afterEach(cleanup)

function fruitSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return (
    <Select label="Fruit" placeholder="Choose fruit" {...props}>
      <SelectItem id="apple">Apple</SelectItem>
      <SelectItem id="banana">Banana</SelectItem>
      <SelectItem id="cherry">Cherry</SelectItem>
    </Select>
  )
}

test('selects an option from a visibly labelled trigger', async () => {
  const user = userEvent.setup()
  render(fruitSelect())

  const trigger = screen.getByRole('button', { name: /Fruit/ })
  expect(trigger.getAttribute('data-size')).toBe('md')
  expect(screen.getByText('Choose fruit')).toBeTruthy()

  await user.click(trigger)
  await user.click(screen.getByRole('option', { name: 'Banana' }))

  expect(screen.getByRole('button', { name: /Fruit/ }).textContent).toContain('Banana')
})

test('supports keyboard opening and typeahead selection', async () => {
  const user = userEvent.setup()
  render(fruitSelect())
  const trigger = screen.getByRole('button', { name: /Fruit/ })

  trigger.focus()
  await user.keyboard('{ArrowDown}')
  expect(screen.getByRole('listbox')).toBeTruthy()

  await user.keyboard('ch{Enter}')

  expect(trigger.textContent).toContain('Cherry')
  await waitFor(() => expect(document.activeElement).toBe(trigger))
})

test('reports controlled changes without replacing product state', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(fruitSelect({ value: 'apple', onChange }))

  const trigger = screen.getByRole('button', { name: /Fruit/ })
  expect(trigger.textContent).toContain('Apple')
  await user.click(trigger)
  await user.click(screen.getByRole('option', { name: 'Banana' }))

  expect(onChange).toHaveBeenCalledWith('banana')
  expect(trigger.textContent).toContain('Apple')
})

test('does not select a disabled item', async () => {
  const user = userEvent.setup()
  render(
    <Select label="Fruit" placeholder="Choose fruit">
      <SelectItem id="apple">Apple</SelectItem>
      <SelectItem id="banana" disabled>Banana</SelectItem>
    </Select>,
  )

  const trigger = screen.getByRole('button', { name: /Fruit/ })
  await user.click(trigger)
  const option = screen.getByRole('option', { name: 'Banana' })
  expect(option.getAttribute('aria-disabled')).toBe('true')
  await user.click(option)

  expect(trigger.textContent).toContain('Choose fruit')
})

test('associates description and validation error with the field', () => {
  render(fruitSelect({ description: 'Pick one fruit.', errorMessage: 'Fruit is required.', invalid: true }))

  const trigger = screen.getByRole('button', { name: /Fruit/ })
  const describedBy = trigger.getAttribute('aria-describedby') ?? ''
  const description = screen.getByText('Pick one fruit.')
  const error = screen.getByText('Fruit is required.')
  expect(describedBy).toContain(description.id)
  expect(describedBy).toContain(error.id)
  expect(trigger.closest('.canon-select')?.getAttribute('data-invalid')).toBe('true')
})

test('submits the selected key through the native form seam', () => {
  render(
    <form data-testid="form">
      {fruitSelect({ name: 'fruit', defaultValue: 'banana', required: true })}
    </form>,
  )

  const form = screen.getByTestId('form') as HTMLFormElement
  const nativeSelect = form.querySelector('select[name="fruit"]') as HTMLSelectElement
  expect(nativeSelect.value).toBe('banana')
  expect(nativeSelect.required).toBe(true)
  expect(new FormData(form).get('fruit')).toBe('banana')
})

test('requires textValue when option content is not plain text', () => {
  expect(() => render(
    <Select label="Fruit">
      <SelectItem id="apple"><strong>Apple</strong></SelectItem>
    </Select>,
  )).toThrow('SelectItem requires text children or a non-empty textValue')

  expect(() => render(
    <Select label="Fruit">
      <SelectItem id="">Apple</SelectItem>
    </Select>,
  )).toThrow('SelectItem requires a non-empty string id')
})

test('requires a visible label at the runtime boundary', () => {
  expect(() => render(
    <Select label="">
      <SelectItem id="apple">Apple</SelectItem>
    </Select>,
  )).toThrow('Select requires a visible label')
})
