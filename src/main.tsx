import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />,
)

const splash = document.getElementById('boot-splash')
if (splash) {
  requestAnimationFrame(() => {
    splash.classList.add('hidden')
    window.setTimeout(() => splash.remove(), 260)
  })
}
