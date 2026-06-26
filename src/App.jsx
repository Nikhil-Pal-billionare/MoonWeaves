import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/Authcontext'
import { CartProvider } from './context/Cartcontext'

import Navbar from './components/Navbar'
import Cart from './components/Cart'
import AuthModal from './components/AuthModal'
import Footer from './components/Footer'

import Home from './pages/Home'
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'

function AdminGuard({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(192,132,252,0.2)',
        borderTop: '3px solid #c084fc', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (!user || !isAdmin) return <Navigate to="/admin" replace />
  return children
}

function AppInner() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar onAuthOpen={() => setAuthOpen(true)} />
            <Home />
            <Footer />
            <Cart />
            {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
          </>
        } />
        <Route path="/shop" element={
          <>
            <Navbar onAuthOpen={() => setAuthOpen(true)} />
            <Shop />
            <Footer />
            <Cart />
            {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
          </>
        } />
        <Route path="/checkout" element={
          <>
            <Navbar onAuthOpen={() => setAuthOpen(true)} />
            <Checkout />
            <Footer />
            {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminGuard><AdminDashboard /></AdminGuard>
        } />
        <Route path="/admin/products" element={
          <AdminGuard><AdminProducts /></AdminGuard>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
