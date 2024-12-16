import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserProvider, { UserMetaProvider } from './context/userProvider.tsx'




createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <UserProvider>
    <UserMetaProvider>
      <App />
    </UserMetaProvider>
    </UserProvider>
  // </StrictMode>,
)
