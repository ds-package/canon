'use client'

import { TextArea } from '@canon/react'
import { useEffect, useState } from 'react'

import { getTextAreaPlaygroundModel, initialTextAreaPlaygroundState } from '../lib/text-area-playground.mjs'

export function TextAreaPlayground() {
  const [state, setState] = useState(initialTextAreaPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getTextAreaPlaygroundModel(state)

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
    <section className="playground" aria-labelledby="text-area-playground-title">
      <h2 id="text-area-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          <label>
            Size
            <select value={state.size} onChange={(event) => setOption('size', event.target.value)}>
              {['sm', 'md', 'lg'].map((size) => <option key={size}>{size}</option>)}
            </select>
          </label>
          <label>
            Rows
            <input type="number" min="1" max="12" value={state.rows} onChange={(event) => setOption('rows', Math.max(1, Number(event.target.value) || 1))} />
          </label>
          {[
            ['disabled', 'Disabled'],
            ['required', 'Required'],
            ['invalid', 'Invalid'],
            ['readOnly', 'Read only'],
            ['dark', 'Dark theme'],
          ].map(([option, label]) => (
            <label key={option}>
              <input type="checkbox" checked={state[option]} onChange={(event) => setOption(option, event.target.checked)} />
              {label}
            </label>
          ))}
          <div className="playground-actions">
            <button type="button" onClick={() => { setState(initialTextAreaPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
            <button type="button" onClick={copyJsx}>{copyStatus}</button>
            <span className="sr-only" role="status" aria-live="polite">{copyStatus === 'Copy JSX' ? '' : copyStatus}</span>
          </div>
        </div>
        <div className="playground-preview">
          <div className="playground-preview-toolbar">
            <span>Preview</span>
            <span>{model.theme} theme</span>
          </div>
          <div className="playground-preview-stage playground-text-area-stage">
            <TextArea key={model.previewKey} {...model.componentProps} />
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
