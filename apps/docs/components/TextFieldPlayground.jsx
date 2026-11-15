'use client'

import { TextField } from '@canon/react'
import { useEffect, useState } from 'react'

import { getTextFieldPlaygroundModel, initialTextFieldPlaygroundState } from '../lib/text-field-playground.mjs'

export function TextFieldPlayground() {
  const [state, setState] = useState(initialTextFieldPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getTextFieldPlaygroundModel(state)

  useEffect(() => {
    const root = document.documentElement
    const previousTheme = root.getAttribute('data-theme')
    root.setAttribute('data-theme', model.theme)
    return () => {
      if (previousTheme === null) root.removeAttribute('data-theme')
      else root.setAttribute('data-theme', previousTheme)
    }
  }, [model.theme])

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
    <section className="playground" aria-labelledby="text-field-playground-title">
      <h2 id="text-field-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          <label>
            Type
            <select value={state.type} onChange={(event) => setOption('type', event.target.value)}>
              {['text', 'search', 'email', 'password', 'url', 'tel'].map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>
            Size
            <select value={state.size} onChange={(event) => setOption('size', event.target.value)}>
              {['sm', 'md', 'lg'].map((size) => <option key={size}>{size}</option>)}
            </select>
          </label>
          <label>
            Default value
            <input value={state.defaultValue} onChange={(event) => setOption('defaultValue', event.target.value)} />
          </label>
          {[
            ['disabled', 'Disabled'],
            ['required', 'Required'],
            ['invalid', 'Invalid'],
            ['readOnly', 'Read only'],
            ['dark', 'Dark theme'],
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
            <button type="button" onClick={() => { setState(initialTextFieldPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
            <button type="button" onClick={copyJsx}>{copyStatus}</button>
            <span className="sr-only" role="status" aria-live="polite">
              {copyStatus === 'Copy JSX' ? '' : copyStatus}
            </span>
          </div>
        </div>
        <div className="playground-preview">
          <div className="playground-preview-toolbar">
            <span>Preview</span>
            <span>{model.theme} theme</span>
          </div>
          <div className="playground-preview-stage playground-text-field-stage">
            <TextField key={model.previewKey} {...model.componentProps} />
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
