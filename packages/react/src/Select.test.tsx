import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { Select, SelectItem, type SelectProps } from './index'

afterEach(cleanup)

interface FruitSelectProps {
  placeholder?: string
  description?: React.ReactNode
  errorMessage?: React.ReactNode
  invalid?: boolean
  name?: string
  defaultValue?: string | null
  required?: boolean
}

function fruitSelect(props: FruitSelectProps = {}) {
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
  const onValueChange = vi.fn()
  render(
    <Select label="Fruit" value="apple" onValueChange={onValueChange}>
      <SelectItem id="apple">Apple</SelectItem>
      <SelectItem id="banana">Banana</SelectItem>
    </Select>,
  )

  const trigger = screen.getByRole('button', { name: /Fruit/ })
  expect(trigger.textContent).toContain('Apple')
  await user.click(trigger)
  await user.click(screen.getByRole('option', { name: 'Banana' }))

  expect(onValueChange).toHaveBeenCalledWith('banana')
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

test('forwards the explicit focus integration props', () => {
  const onFocus = vi.fn()
  const onBlur = vi.fn()
  render(
    <Select label="Fruit" autoFocus onFocus={onFocus} onBlur={onBlur}>
      <SelectItem id="apple">Apple</SelectItem>
    </Select>,
  )

  const trigger = screen.getByRole('button', { name: /Fruit/ })
  expect(document.activeElement).toBe(trigger)
  fireEvent.focus(trigger)
  fireEvent.blur(trigger)
  expect(onFocus).toHaveBeenCalled()
  expect(onBlur).toHaveBeenCalledOnce()
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

test('rejects inaccessible runtime input', () => {
  expect(() => render(
    <Select label="">
      <SelectItem id="apple">Apple</SelectItem>
    </Select>,
  )).toThrow('Select requires a visible label')
  expect(() => render(
    <Select label="Fruit" invalid><SelectItem id="apple">Apple</SelectItem></Select>,
  )).toThrow('Select requires errorMessage when invalid is true')
})

test('rejects ambiguous or incomplete controlled state at runtime', () => {
  const ambiguous = { label: 'Fruit', value: 'apple', defaultValue: 'banana', onValueChange: () => {} } as unknown as SelectProps
  const incomplete = { label: 'Fruit', value: 'apple' } as unknown as SelectProps
  expect(() => render(
    <Select {...ambiguous}><SelectItem id="apple">Apple</SelectItem></Select>,
  )).toThrow(
    'Select cannot use value and defaultValue together',
  )
  expect(() => render(
    <Select {...incomplete}><SelectItem id="apple">Apple</SelectItem></Select>,
  )).toThrow(
    'Controlled Select requires onValueChange',
  )
})
