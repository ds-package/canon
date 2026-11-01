import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  type DialogTriggerProps,
} from './index'

afterEach(cleanup)

function exampleDialog({ dismissable = false, keyboardDismissDisabled = false } = {}) {
  return (
    <Dialog dismissable={dismissable} keyboardDismissDisabled={keyboardDismissDisabled}>
      <DialogTitle>Delete document?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
      <DialogBody>Review the document before deleting it.</DialogBody>
      <DialogFooter>Actions</DialogFooter>
    </Dialog>
  )
}

test('opens a dialog with its visible title and description', async () => {
  const user = userEvent.setup()
  render(
    <DialogTrigger>
      <button>Delete document</button>
      {exampleDialog()}
    </DialogTrigger>,
  )

  await user.click(screen.getByRole('button', { name: 'Delete document' }))

  const dialog = screen.getByRole('dialog', { name: 'Delete document?' })
  expect(dialog.getAttribute('aria-describedby')).toBeTruthy()
  expect(screen.getByText('This action cannot be undone.')).toBeTruthy()
})

test('rejects dialogs without a direct title and description', () => {
  expect(() => render(<Dialog><DialogTitle>Title</DialogTitle></Dialog>)).toThrow(
    'Dialog requires a direct DialogTitle and DialogDescription',
  )
})

test('rejects a trigger that is not a native button', () => {
  const children = [<span>Open</span>, exampleDialog()] as unknown as DialogTriggerProps['children']
  expect(() => render(<DialogTrigger>{children}</DialogTrigger>)).toThrow(
    'DialogTrigger requires a native button trigger',
  )
})

test('rejects a second child that is not Dialog', () => {
  const children = [<button>Open</button>, <div>Not a dialog</div>] as unknown as DialogTriggerProps['children']
  expect(() => render(<DialogTrigger>{children}</DialogTrigger>)).toThrow(
    'DialogTrigger requires Dialog as its second child',
  )
})

test('does not submit a containing form when the trigger type is omitted', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(
    <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
      <DialogTrigger>
        <button>Delete document</button>
        {exampleDialog()}
      </DialogTrigger>
    </form>,
  )

  await user.click(screen.getByRole('button', { name: 'Delete document' }))

  expect(onSubmit).not.toHaveBeenCalled()
  expect(screen.getByRole('dialog')).toBeTruthy()
})

test('reports controlled open changes without owning product state', async () => {
  const user = userEvent.setup()
  const onOpenChange = vi.fn()
  render(
    <DialogTrigger open={false} onOpenChange={onOpenChange}>
      <button>Delete document</button>
      {exampleDialog()}
    </DialogTrigger>,
  )

  await user.click(screen.getByRole('button', { name: 'Delete document' }))

  expect(onOpenChange).toHaveBeenCalledWith(true)
  expect(screen.queryByRole('dialog')).toBeNull()
})

test('Escape closes the dialog and returns focus to its trigger', async () => {
  const user = userEvent.setup()
  render(
    <DialogTrigger>
      <button>Delete document</button>
      {exampleDialog()}
    </DialogTrigger>,
  )
  const trigger = screen.getByRole('button', { name: 'Delete document' })
  await user.click(trigger)

  await user.keyboard('{Escape}')

  expect(screen.queryByRole('dialog')).toBeNull()
  await waitFor(() => expect(document.activeElement).toBe(trigger))
})

test('keyboard dismissal can be disabled', async () => {
  const user = userEvent.setup()
  render(
    <DialogTrigger>
      <button>Delete document</button>
      {exampleDialog({ keyboardDismissDisabled: true })}
    </DialogTrigger>,
  )
  await user.click(screen.getByRole('button', { name: 'Delete document' }))

  await user.keyboard('{Escape}')

  expect(screen.getByRole('dialog')).toBeTruthy()
})

test('dismissable dialogs close when the overlay is pressed', async () => {
  const user = userEvent.setup()
  render(
    <DialogTrigger>
      <button>Delete document</button>
      {exampleDialog({ dismissable: true })}
    </DialogTrigger>,
  )
  await user.click(screen.getByRole('button', { name: 'Delete document' }))

  await user.click(document.querySelector('.canon-dialog-overlay') as HTMLElement)

  expect(screen.queryByRole('dialog')).toBeNull()
})
