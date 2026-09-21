import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AdminAuth from './components/AdminAuth.jsx'
import './index.css'
import './components/admin.css'

const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin'
createRoot(document.getElementById('root')).render(<React.StrictMode>{isAdminRoute ? <AdminAuth /> : <App />}</React.StrictMode>)
