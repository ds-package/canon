'use client'

import { Checkbox } from '@canon/react'
import { useEffect, useState } from 'react'

import { getCheckboxPlaygroundModel, initialCheckboxPlaygroundState } from '../lib/checkbox-playground.mjs'

export function CheckboxPlayground() {
  const [state, setState] = useState(initialCheckboxPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getCheckboxPlaygroundModel(state)

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
    <section className="playground" aria-labelledby="checkbox-playground-title">
      <h2 id="checkbox-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          {[
            ['defaultChecked', 'Default checked'],
            ['indeterminate', 'Indeterminate'],
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
            <button type="button" onClick={() => { setState(initialCheckboxPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
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
          <div className="playground-preview-stage playground-checkbox-stage">
            <Checkbox
              key={model.previewKey}
              {...model.componentProps}
              onCheckedChange={(checked) => setState((current) => ({
                ...current,
                defaultChecked: checked,
                indeterminate: false,
              }))}
            >
              Accept the terms
            </Checkbox>
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
