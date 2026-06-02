import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { EventProvider } from "./context/EventContext";
import { CollaProvider } from "./context/CollaContext.jsx";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <EventProvider>
        <CollaProvider>
          <App />
        </CollaProvider>
      </EventProvider>
    </BrowserRouter>
  </StrictMode>,
)