import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/base.css'
import './styles/shell.css'
import './styles/home.css'
import './styles/widgets.css'
import './styles/about.css'
import './styles/contact.css'
import './styles/interact.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Dev-only handle for verifying scroll wiring when the preview pane can't produce frames.
if (import.meta.env.DEV) {
  Promise.all([import('./lib/motion'), import('./scene/store')]).then(([m, s]) => {
    Object.assign(window, { __hk: { ScrollTrigger: m.ScrollTrigger, gsap: m.gsap, scene: s.sceneStore } })
  })
}

// StrictMode is intentionally off: it double-mounts the WebGL scene and GSAP contexts in dev.
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
