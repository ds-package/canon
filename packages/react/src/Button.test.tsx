import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import { Button, IconButton, type IconButtonProps } from './index'

afterEach(cleanup)

test('uses safe primary defaults and handles an accessible press', async () => {
  const user = userEvent.setup()
  const onPress = vi.fn()
  render(<Button onPress={onPress}>Save</Button>)

  const button = screen.getByRole('button', { name: 'Save' })
  expect(button.getAttribute('type')).toBe('button')
  expect(button.getAttribute('data-variant')).toBe('primary')
  expect(button.getAttribute('data-size')).toBe('md')

  await user.click(button)
  expect(onPress).toHaveBeenCalledOnce()
})

test('requires an accessible name for an icon-only button at runtime', () => {
  expect(() => render(<IconButton aria-label="" icon={<svg />} />)).toThrow(
    'IconButton requires a non-empty aria-label',
  )

  const missingLabel = { icon: <svg /> } as IconButtonProps
  expect(() => render(<IconButton {...missingLabel} />)).toThrow(
    'IconButton requires a non-empty aria-label',
  )
})

test('exposes every documented variant and size through the public DOM contract', () => {
  for (const variant of ['primary', 'secondary', 'quiet', 'destructive'] as const) {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
      const { unmount } = render(<Button variant={variant} size={size}>{variant} {size}</Button>)
      const button = screen.getByRole('button', { name: `${variant} ${size}` })
      expect(button.getAttribute('data-variant')).toBe(variant)
      expect(button.getAttribute('data-size')).toBe(size)
      unmount()
    }
  }
})

test('keeps decorative icons out of the accessible name and exposes the largest size', () => {
  render(<IconButton aria-label="Close" icon={<svg data-testid="icon"><title>Hidden icon title</title></svg>} size="xl" />)

  const button = screen.getByRole('button', { name: 'Close' })
  expect(button.getAttribute('data-variant')).toBe('quiet')
  expect(button.getAttribute('data-size')).toBe('xl')
  expect(button.getAttribute('data-shape')).toBe('square')
  expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).toBeTruthy()
})

test('disabled and pending buttons do not run product actions', async () => {
  const user = userEvent.setup()
  const onPress = vi.fn()
  render(
    <>
      <Button disabled onPress={onPress}>Disabled</Button>
      <Button pending onPress={onPress}>Pending</Button>
    </>,
  )

  await user.click(screen.getByRole('button', { name: 'Disabled' }))
  await user.click(screen.getByRole('button', { name: 'Pending' }))

  expect(onPress).not.toHaveBeenCalled()
})

test('pending exposes progress and preserves focus and the action name', () => {
  const { rerender } = render(<Button>Save changes</Button>)
  const button = screen.getByRole('button', { name: 'Save changes' })
  button.focus()

  rerender(<Button pending>Save changes</Button>)

  expect(document.activeElement).toBe(button)
  expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeTruthy()
  expect(screen.getByRole('button', { name: /Save changes/ })).toBe(button)
})

test('rejects an unnamed pending indicator', () => {
  expect(() => render(<Button pending pendingLabel="">Save changes</Button>)).toThrow(
    'Button pendingLabel must be a non-empty string',
  )
})
