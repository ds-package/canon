'use client'

import { RadioGroup, RadioOption } from '@canon/react'
import { useEffect, useState } from 'react'

import { getRadioGroupPlaygroundModel, initialRadioGroupPlaygroundState } from '../lib/radio-group-playground.mjs'

export function RadioGroupPlayground() {
  const [state, setState] = useState(initialRadioGroupPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getRadioGroupPlaygroundModel(state)

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
    <section className="playground" aria-labelledby="radio-group-playground-title">
      <h2 id="radio-group-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          <label>
            Default value
            <select value={state.defaultValue} onChange={(event) => setOption('defaultValue', event.target.value)}>
              <option value="">None</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </label>
          <label>
            Orientation
            <select value={state.orientation} onChange={(event) => setOption('orientation', event.target.value)}>
              <option value="vertical">vertical</option>
              <option value="horizontal">horizontal</option>
            </select>
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
            <button type="button" onClick={() => { setState(initialRadioGroupPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
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
          <div className="playground-preview-stage playground-radio-group-stage">
            <RadioGroup
              key={model.previewKey}
              {...model.componentProps}
              onValueChange={(value) => setState((current) => ({ ...current, defaultValue: value }))}
            >
              <RadioOption value="free">Free</RadioOption>
              <RadioOption value="pro">Pro</RadioOption>
              <RadioOption value="team" disabled>Team</RadioOption>
            </RadioGroup>
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
