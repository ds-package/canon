'use client'

import { Switch } from '@canon/react'
import { useEffect, useState } from 'react'

import { getSwitchPlaygroundModel, initialSwitchPlaygroundState } from '../lib/switch-playground.mjs'

export function SwitchPlayground() {
  const [state, setState] = useState(initialSwitchPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getSwitchPlaygroundModel(state)

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
    <section className="playground" aria-labelledby="switch-playground-title">
      <h2 id="switch-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          {[
            ['defaultChecked', 'Default checked'],
            ['disabled', 'Disabled'],
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
            <button type="button" onClick={() => { setState(initialSwitchPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
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
          <div className="playground-preview-stage playground-switch-stage">
            <Switch
              key={model.previewKey}
              {...model.componentProps}
              onCheckedChange={(checked) => setState((current) => ({ ...current, defaultChecked: checked }))}
            >
              Notifications
            </Switch>
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
