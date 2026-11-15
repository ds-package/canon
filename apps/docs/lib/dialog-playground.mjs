export const initialDialogPlaygroundState = Object.freeze({
  closeOnInteractOutside: true,
  closeOnEscape: true,
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
    dialogProps: {
      closeOnInteractOutside: state.closeOnInteractOutside,
      closeOnEscape: state.closeOnEscape,
    },
    showCloseButton: state.showCloseButton,
    showFooter: state.showFooter,
    jsx: [
      '<DialogTrigger>',
      '  <button type="button">Open dialog</button>',
      `  <Dialog${state.closeOnInteractOutside ? ' closeOnInteractOutside' : ''}${state.closeOnEscape ? '' : ' closeOnEscape={false}'}>`,
      ...parts,
      '  </Dialog>',
      '</DialogTrigger>',
    ].join('\n'),
  }
}
