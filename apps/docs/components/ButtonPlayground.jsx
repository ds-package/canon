'use client'

import { Button, IconButton } from '@canon/react'
import { useEffect, useState } from 'react'

import { getButtonPlaygroundModel, initialButtonPlaygroundState } from '../lib/button-playground.mjs'

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function ButtonPlayground() {
  const [state, setState] = useState(initialButtonPlaygroundState)
  const [copyStatus, setCopyStatus] = useState('Copy JSX')
  const model = getButtonPlaygroundModel(state)

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
    <section className="playground" aria-labelledby="button-playground-title">
      <h2 id="button-playground-title">Playground</h2>
      <div className="playground-layout">
        <div className="playground-controls">
          <label>
            Component
            <select value={state.component} onChange={(event) => setOption('component', event.target.value)}>
              <option value="button">Button</option>
              <option value="icon">IconButton</option>
            </select>
          </label>
          <label>
            Variant
            <select value={state.variant} onChange={(event) => setOption('variant', event.target.value)}>
              {['primary', 'secondary', 'quiet', 'destructive'].map((variant) => <option key={variant}>{variant}</option>)}
            </select>
          </label>
          <label>
            Size
            <select value={state.size} onChange={(event) => setOption('size', event.target.value)}>
              {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => <option key={size}>{size}</option>)}
            </select>
          </label>
          {state.component === 'icon' && (
            <label>
              Shape
              <select value={state.shape} onChange={(event) => setOption('shape', event.target.value)}>
                <option value="square">square</option>
                <option value="round">round</option>
              </select>
            </label>
          )}
          {[
            ['disabled', 'Disabled'],
            ['pending', 'Pending'],
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
            <button type="button" onClick={() => { setState(initialButtonPlaygroundState); setCopyStatus('Copy JSX') }}>Reset</button>
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
          <div className="playground-preview-stage playground-button-stage">
            {model.component === 'Button' ? (
              <Button {...model.componentProps}>Save changes</Button>
            ) : (
              <IconButton icon={<XIcon />} {...model.componentProps} />
            )}
          </div>
        </div>
      </div>
      <pre className="playground-code"><code>{model.jsx}</code></pre>
    </section>
  )
}
