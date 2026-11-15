'use client'

import { NumberField } from '@canon/react'
import { useEffect, useState } from 'react'

import { getNumberFieldPlaygroundModel, initialNumberFieldPlaygroundState } from '../lib/number-field-playground.mjs'

export function NumberFieldPlayground() {
  const [state, setState] = useState(initialNumberFieldPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getNumberFieldPlaygroundModel(state)

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
    <section className="playground" aria-labelledby="number-field-playground-title">
      <h2 id="number-field-playground-title">Playground</h2>
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
            <input
              type="number"
              value={state.defaultValue ?? ''}
              onChange={(event) => setOption('defaultValue', event.target.value === '' ? null : Number(event.target.value))}
            />
          </label>
          <label>
            Minimum
            <input type="number" value={state.minValue} onChange={(event) => setOption('minValue', Math.min(Number(event.target.value), state.maxValue))} />
          </label>
          <label>
            Maximum
            <input type="number" value={state.maxValue} onChange={(event) => setOption('maxValue', Math.max(Number(event.target.value), state.minValue))} />
          </label>
          <label>
            Step
            <input type="number" min="0.1" step="0.1" value={state.step} onChange={(event) => setOption('step', Math.max(0.1, Number(event.target.value) || 0.1))} />
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
            <button type="button" onClick={() => { setState(initialNumberFieldPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
            <button type="button" onClick={copyJsx}>{copyStatus}</button>
            <span className="sr-only" role="status" aria-live="polite">{copyStatus === 'Copy JSX' ? '' : copyStatus}</span>
          </div>
        </div>
        <div className="playground-preview">
          <div className="playground-preview-toolbar">
            <span>Preview</span>
            <span>{model.theme} theme</span>
          </div>
          <div className="playground-preview-stage playground-number-field-stage">
            <NumberField key={model.previewKey} {...model.componentProps} />
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
