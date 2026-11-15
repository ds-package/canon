import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { Switch } from './index'

afterEach(cleanup)

test('toggles an immediate setting through click and keyboard', async () => {
  const user = userEvent.setup()
  render(<Switch>Reduce motion</Switch>)
  const toggle = screen.getByRole('switch', { name: 'Reduce motion' })

  await user.click(toggle)
  expect((toggle as HTMLInputElement).checked).toBe(true)

  toggle.focus()
  await user.keyboard(' ')
  expect((toggle as HTMLInputElement).checked).toBe(false)
})

test('reports controlled changes without replacing product state', async () => {
  const user = userEvent.setup()
  const onCheckedChange = vi.fn()
  render(<Switch checked={false} onCheckedChange={onCheckedChange}>Notifications</Switch>)

  const toggle = screen.getByRole('switch', { name: 'Notifications' })
  await user.click(toggle)

  expect(onCheckedChange).toHaveBeenCalledWith(true)
  expect((toggle as HTMLInputElement).checked).toBe(false)
})

test('submits native values to its nearest and external forms', () => {
  render(
    <>
      <form data-testid="nearest-form">
        <Switch name="digest" value="daily" defaultChecked>Email digest</Switch>
      </form>
      <form id="settings" data-testid="external-form" />
      <Switch form="settings" name="updates" value="yes" defaultChecked>Product updates</Switch>
    </>,
  )

  expect(new FormData(screen.getByTestId('nearest-form') as HTMLFormElement).get('digest')).toBe('daily')
  expect(new FormData(screen.getByTestId('external-form') as HTMLFormElement).get('updates')).toBe('yes')
})

test('associates a description with the switch', () => {
  render(<Switch description="Uses less animation.">Reduce motion</Switch>)

  const toggle = screen.getByRole('switch', { name: 'Reduce motion' })
  expect(toggle.getAttribute('aria-describedby')).toContain(screen.getByText('Uses less animation.').id)
})

test('disabled and read-only switches do not change', async () => {
  const user = userEvent.setup()
  render(
    <>
      <Switch disabled>Disabled</Switch>
      <Switch readOnly>Read only</Switch>
    </>,
  )

  const disabled = screen.getByRole('switch', { name: 'Disabled' })
  const readOnly = screen.getByRole('switch', { name: 'Read only' })
  await user.click(disabled)
  await user.click(readOnly)
  readOnly.focus()
  await user.keyboard(' ')
  expect((disabled as HTMLInputElement).checked).toBe(false)
  expect((readOnly as HTMLInputElement).checked).toBe(false)
})

test('rejects inaccessible and ambiguous runtime input', () => {
  expect(() => render(<Switch>{''}</Switch>)).toThrow('Switch requires a visible label')
  expect(() => render(<Switch>{null as never}</Switch>)).toThrow('Switch requires a visible label')
  expect(() => render(<Switch checked={false as never}>Controlled</Switch>)).toThrow(
    'Controlled Switch requires onCheckedChange',
  )
  expect(() => render(
    <Switch checked={false as never} defaultChecked={false as never} onCheckedChange={() => {}}>
      Conflicting
    </Switch>,
  )).toThrow('Switch cannot use checked and defaultChecked together')
})
