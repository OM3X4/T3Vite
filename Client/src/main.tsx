import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from './Components/ui/tooltip.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <Router>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  </Router>
)
