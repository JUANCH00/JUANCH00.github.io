import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StaticProfileRepository } from '@infrastructure/profile/StaticProfileRepository'
import { App } from '@app/App'
import '@ui/styles/global.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Missing #root element — check index.html')
}

/**
 * Entry point: pick the concrete adapters, hand them to the app, mount.
 * This is the only place in the codebase that knows *which* implementations
 * are in use.
 */
createRoot(container).render(
  <StrictMode>
    <App repository={new StaticProfileRepository()} />
  </StrictMode>,
)
