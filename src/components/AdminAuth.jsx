import { useEffect, useState } from 'react'
import { KeyRound, LogOut, Mail, Save } from 'lucide-react'
import { adminEmail, supabase } from '../supabase.js'
import AdminPanel from './AdminPanel.jsx'

export default function AdminAuth() {
  const [session, setSession] = useState(null)
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState(adminEmail)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      if (event === 'PASSWORD_RECOVERY') setMode('new-password')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const login = async (event) => {
    event.preventDefault()
    if (email.trim().toLowerCase() !== adminEmail) return setMessage('Only the portfolio owner email can access this admin panel.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error ? error.message : '')
  }
  const reset = async (event) => {
    event.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, { redirectTo: `${window.location.origin}/admin` })
    setMessage(error ? error.message : `A password-reset link was sent to ${adminEmail}.`)
  }
  const updatePassword = async (event) => {
    event.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    setMessage(error ? error.message : 'Password updated. You can now access the admin panel.')
    if (!error) setMode('login')
  }
  const logout = async () => { await supabase.auth.signOut(); setSession(null) }

  if (loading) return <div className="admin-auth"><p>Checking secure admin access…</p></div>
  if (!supabase) return <div className="admin-auth"><div className="admin-auth-card"><KeyRound size={28} /><h1>Admin setup needed</h1><p>Add your Supabase Project URL and anon key to a local <code>.env</code> file before using secure admin access.</p><pre>VITE_SUPABASE_URL=your-project-url{`\n`}VITE_SUPABASE_ANON_KEY=your-anon-key</pre></div></div>
  if (session?.user?.email?.toLowerCase() === adminEmail) return <><button className="admin-logout" onClick={logout}><LogOut size={14} /> Sign out</button><AdminPanel /></>
  return <div className="admin-auth"><form className="admin-auth-card" onSubmit={mode === 'login' ? login : mode === 'reset' ? reset : updatePassword}><KeyRound size={28} /><span className="admin-label">SECURE CONTENT MANAGER</span><h1>{mode === 'login' ? 'Admin sign in' : mode === 'reset' ? 'Reset password' : 'Set a new password'}</h1>{mode === 'login' && <><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label></>}{mode === 'new-password' && <label>New password<input type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>}{mode === 'reset' && <p>A reset link will be sent only to {adminEmail}.</p>}<button className="button button-primary" type="submit">{mode === 'login' ? <><KeyRound size={15} /> Sign in</> : mode === 'reset' ? <><Mail size={15} /> Send reset link</> : <><Save size={15} /> Save password</>}</button>{message && <p className="admin-auth-message">{message}</p>}{mode === 'login' ? <button type="button" className="admin-auth-link" onClick={() => setMode('reset')}>Forgot password?</button> : <button type="button" className="admin-auth-link" onClick={() => { setMode('login'); setMessage('') }}>Back to sign in</button>}</form></div>
}
