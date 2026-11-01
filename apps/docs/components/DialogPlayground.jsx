'use client'

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@canon/react'
import { useState } from 'react'

import { getDialogPlaygroundModel, initialDialogPlaygroundState } from '../lib/dialog-playground.mjs'

export function DialogPlayground() {
  const [state, setState] = useState(initialDialogPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getDialogPlaygroundModel(state)

  function setOption(option, value) {
    setState((current) => ({ ...current, [option]: value }))
    setCopyStatus('Copy JSX')
  }

  async function copyJsx() {
    try {
      await navigator.clipboard.writeText(model.jsx)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Copy failed')
    }
  }

  return (
    <section className="playground" aria-labelledby="dialog-playground-title">
      <h2 id="dialog-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          {[
            ['dismissable', 'Dismissable'],
            ['showCloseButton', 'Close button'],
            ['showFooter', 'Footer'],
          ].map(([option, label]) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={state[option]}
                onChange={(event) => setOption(option, event.target.checked)}
              />
              {label}
            </label>
          ))}
          <div className="playground-actions">
            <button type="button" onClick={() => { setState(initialDialogPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
            <button type="button" onClick={copyJsx}>{copyStatus}</button>
            <span className="sr-only" role="status" aria-live="polite">
              {copyStatus === 'Copy JSX' ? '' : copyStatus}
            </span>
          </div>
        </div>
        <div className="playground-preview">
          <div className="playground-preview-toolbar">
            <span>Preview</span>
            <DialogTrigger>
              <button type="button">Open interactive dialog</button>
              <Dialog {...model.dialogProps}>
                {model.showCloseButton && <DialogClose aria-label="Close dialog" />}
                <DialogTitle>Delete document?</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
                <DialogBody>Review the document before deleting it.</DialogBody>
                {model.showFooter && <DialogFooter><DialogClose>Done</DialogClose></DialogFooter>}
              </Dialog>
            </DialogTrigger>
          </div>
          <div className="playground-preview-stage">
            <div className="canon-dialog-modal playground-dialog-specimen" aria-hidden="true">
              <div className="canon-dialog">
                {model.showCloseButton && <span className="canon-dialog-close playground-specimen-close">×</span>}
                <DialogTitle>Delete document?</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
                <DialogBody>Review the document before deleting it.</DialogBody>
                {model.showFooter && <DialogFooter><span className="canon-dialog-close">Done</span></DialogFooter>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
