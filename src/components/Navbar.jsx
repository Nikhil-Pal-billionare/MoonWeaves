import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: '#FFFFFF',
    borderBottom: '1px solid rgba(176,38,79,0.12)',
    boxShadow: '0 1px 0 rgba(36,16,22,0.04), 0 4px 16px rgba(36,16,22,0.04)',
    padding: '0 24px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22, fontWeight: 700, color: '#B0264F',
    fontFamily: "'Playfair Display', serif",
    textDecoration: 'none', letterSpacing: '-0.3px',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  logoMoon: { fontSize: 20 },
  links: { display: 'flex', gap: 28, listStyle: 'none' },
  link: { color: '#4A3B38', textDecoration: 'none', fontSize: 14, fontWeight: 500,
    transition: 'color 0.2s' },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#4A3B38', position: 'relative', padding: 6, borderRadius: 8,
    display: 'flex', alignItems: 'center', transition: 'color 0.2s',
  },
  badge: {
    position: 'absolute', top: 0, right: 0,
    background: '#B0264F', color: '#FFF8F2', fontSize: 10,
    fontWeight: 700, borderRadius: '50%', width: 16, height: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute', top: 44, right: 0,
    background: '#FFFFFF', border: '1px solid rgba(176,38,79,0.15)',
    borderRadius: 12, minWidth: 160, overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(36,16,22,0.12)',
  },
  dropItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', color: '#4A3B38', cursor: 'pointer',
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
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(176,38,79,0.2)', fontSize: 12, color: '#8B6F66' }}>
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
