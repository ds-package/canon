'use client'

import { Select, SelectItem } from '@canon/react'
import { useEffect, useState } from 'react'

import { getSelectPlaygroundModel, initialSelectPlaygroundState } from '../lib/select-playground.mjs'

export function SelectPlayground() {
  const [state, setState] = useState(initialSelectPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getSelectPlaygroundModel(state)

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
    <section className="playground" aria-labelledby="select-playground-title">
      <h2 id="select-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          <label>
            Size
            <select value={state.size} onChange={(event) => setOption('size', event.target.value)}>
              {['sm', 'md', 'lg'].map((size) => <option key={size}>{size}</option>)}
            </select>
          </label>
          <label>
            Default value
            <select value={state.defaultValue} onChange={(event) => setOption('defaultValue', event.target.value)}>
              <option value="">None</option>
              <option value="apple">Apple</option>
              <option value="banana">Banana</option>
            </select>
          </label>
          {[
            ['disabled', 'Disabled'],
            ['required', 'Required'],
            ['invalid', 'Invalid'],
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
            <button type="button" onClick={() => { setState(initialSelectPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
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
          <div className="playground-preview-stage playground-select-stage">
            <Select key={model.previewKey} {...model.componentProps}>
              <SelectItem id="apple">Apple</SelectItem>
              <SelectItem id="banana">Banana</SelectItem>
              <SelectItem id="orange" disabled>Orange</SelectItem>
            </Select>
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
