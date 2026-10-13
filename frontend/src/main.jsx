import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './projectpool.css'
import App from './ProjectPool.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
