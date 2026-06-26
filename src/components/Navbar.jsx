import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(139,92,246,0.2)',
    padding: '0 24px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22, fontWeight: 700, color: '#c084fc',
    textDecoration: 'none', letterSpacing: '-0.5px',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  logoMoon: { fontSize: 20 },
  links: { display: 'flex', gap: 28, listStyle: 'none' },
  link: { color: '#d1b3ff', textDecoration: 'none', fontSize: 14, fontWeight: 500,
    transition: 'color 0.2s' },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#d1b3ff', position: 'relative', padding: 6, borderRadius: 8,
    display: 'flex', alignItems: 'center', transition: 'color 0.2s',
  },
  badge: {
    position: 'absolute', top: 0, right: 0,
    background: '#c084fc', color: '#0a0a0f', fontSize: 10,
    fontWeight: 700, borderRadius: '50%', width: 16, height: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute', top: 44, right: 0,
    background: '#1a1025', border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: 12, minWidth: 160, overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  dropItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', color: '#d1b3ff', cursor: 'pointer',
    fontSize: 14, textDecoration: 'none', background: 'none',
    border: 'none', width: '100%', transition: 'background 0.15s',
  },
}

export default function Navbar({ onAuthOpen }) {
  const { cartCount, setCartOpen } = useCart()
  const { user, isAdmin, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const navigate = useNavigate()

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoMoon}>🌙</span> MoonWeaver
      </Link>

      <ul style={{ ...styles.links, display: window.innerWidth < 640 ? 'none' : 'flex' }}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/shop" style={styles.link}>Shop</Link></li>
        <li><Link to="/shop?cat=Silk" style={styles.link}>Silk</Link></li>
        <li><Link to="/shop?cat=Banarasi" style={styles.link}>Banarasi</Link></li>
        <li><Link to="/shop?cat=Cotton" style={styles.link}>Cotton</Link></li>
      </ul>

      <div style={styles.right}>
        <button style={styles.iconBtn} onClick={() => navigate('/shop')}>
          <Search size={20} />
        </button>

        <button style={styles.iconBtn} onClick={() => setCartOpen(true)}>
          <ShoppingBag size={20} />
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </button>

        <div style={{ position: 'relative' }}>
          <button style={styles.iconBtn} onClick={() => user ? setUserDropdown(!userDropdown) : onAuthOpen()}>
            <User size={20} />
          </button>

          {user && userDropdown && (
            <div style={styles.dropdown} onMouseLeave={() => setUserDropdown(false)}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(139,92,246,0.2)', fontSize: 12, color: '#9b73d4' }}>
                {user.email}
              </div>
              {isAdmin && (
                <Link to="/admin" style={styles.dropItem} onClick={() => setUserDropdown(false)}>
                  <Settings size={14} /> Admin Panel
                </Link>
              )}
              <button style={styles.dropItem} onClick={() => { signOut(); setUserDropdown(false) }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
