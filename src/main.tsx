import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const rootElement = document.getElementById('root')
const queryClient = new QueryClient()

if (!rootElement) {
  throw new Error('Root element was not found')
}

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
