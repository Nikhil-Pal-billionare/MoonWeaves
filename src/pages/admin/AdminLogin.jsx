import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { signIn, signInWithGoogle, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user && isAdmin) {
    navigate('/admin/dashboard')
    return null
  }

  async function handleLogin() {
    setError(''); setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false); return }
    // isAdmin check happens in AuthContext, navigate after
    setTimeout(() => {
      navigate('/admin/dashboard')
      setLoading(false)
    }, 500)
  }

  const inp = {
    background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.25)',
    color: '#e8d5ff', borderRadius: 10, padding: '12px 14px 12px 40px',
    fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
      background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, #0a0a0f 70%)' }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#120f1e', borderRadius: 20,
        border: '1px solid rgba(139,92,246,0.3)', padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌙</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e8d5ff' }}>Admin Panel</h1>
          <p style={{ fontSize: 13, color: '#6b5a80', marginTop: 4 }}>MoonWeaver Management</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9b73d4' }} />
            <input type="email" placeholder="Admin Email" value={email}
              onChange={e => setEmail(e.target.value)} style={inp} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9b73d4' }} />
            <input type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inp} />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, fontSize: 13, color: '#f87171' }}>
            {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', marginTop: 20, padding: '13px 0', borderRadius: 12, border: 'none',
            background: loading ? '#3b1f6b' : 'linear-gradient(135deg,#7c3aed,#c026d3)',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(139,92,246,0.2)' }} />
          <span style={{ fontSize: 12, color: '#6b5a80' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(139,92,246,0.2)' }} />
        </div>

        <button onClick={signInWithGoogle}
          style={{ width: '100%', padding: '12px 0', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#e8d5ff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}
