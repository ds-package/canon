export const initialDialogPlaygroundState = Object.freeze({
  dismissable: true,
  showCloseButton: true,
  showFooter: true,
})

export function getDialogPlaygroundModel(state) {
  const parts = [
    state.showCloseButton && '    <DialogClose aria-label="Close dialog" />',
    '    <DialogTitle>Delete document?</DialogTitle>',
    '    <DialogDescription>This action cannot be undone.</DialogDescription>',
    '    <DialogBody>Review the document before deleting it.</DialogBody>',
    state.showFooter && '    <DialogFooter>\n      <DialogClose>Done</DialogClose>\n    </DialogFooter>',
  ].filter(Boolean)

  return {
    dialogProps: { dismissable: state.dismissable },
    showCloseButton: state.showCloseButton,
    showFooter: state.showFooter,
    jsx: [
      '<DialogTrigger>',
      '  <button type="button">Open dialog</button>',
      `  <Dialog${state.dismissable ? ' dismissable' : ''}>`,
      ...parts,
      '  </Dialog>',
      '</DialogTrigger>',
    ].join('\n'),
  }
}
