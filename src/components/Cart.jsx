import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart()
  const navigate = useNavigate()

  if (!cartOpen) return null

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 3000, backdropFilter: 'blur(4px)' }}
        onClick={() => setCartOpen(false)} />

      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 3001,
        width: '100%', maxWidth: 420,
        background: '#FFFFFF', borderLeft: '1px solid rgba(176,38,79,0.3)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(176,38,79,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color='#B0264F' />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#241016' }}>Shopping Bag</span>
            <span style={{ background: 'rgba(176,38,79,0.15)', color: '#B0264F',
              fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
              {cart.length} items
            </span>
          </div>
          <button onClick={() => setCartOpen(false)}
            style={{ background: 'none', border: 'none', color: '#8B6F66', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cart.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 12, color: '#9C8983', paddingTop: 60 }}>
              <ShoppingBag size={48} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: 16 }}>Your bag is empty</p>
              <button onClick={() => { setCartOpen(false); navigate('/shop') }}
                style={{ background: 'linear-gradient(135deg,#B0264F,#7A1635)',
                  color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
                Shop Now
              </button>
            </div>
          ) : cart.map(item => {
            const img = item.images?.[0] || 'https://placehold.co/80x104/FBEAE3/B0264F?text=M'
            return (
              <div key={item.id} style={{ display: 'flex', gap: 14, background: '#FBEAE3',
                borderRadius: 14, padding: 14, border: '1px solid rgba(176,38,79,0.15)' }}>
                <img src={img} alt={item.name}
                  style={{ width: 70, height: 90, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p style={{ fontSize: 13, color: '#241016', fontWeight: 500, lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.name}
                  </p>
                  {item.fabric && <p style={{ fontSize: 11, color: '#8B6F66' }}>{item.fabric}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#B0264F' }}>
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        style={{ background: 'rgba(176,38,79,0.2)', border: 'none', color: '#B0264F',
                          cursor: 'pointer', width: 26, height: 26, borderRadius: 7, display: 'flex',
                          alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#241016', minWidth: 16, textAlign: 'center' }}>
                        {item.qty}
                      </span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        style={{ background: 'rgba(176,38,79,0.2)', border: 'none', color: '#B0264F',
                          cursor: 'pointer', width: 26, height: 26, borderRadius: 7, display: 'flex',
                          alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeFromCart(item.id)}
                        style={{ background: 'rgba(220,38,38,0.1)', border: 'none', color: '#DC2626',
                          cursor: 'pointer', width: 26, height: 26, borderRadius: 7, display: 'flex',
                          alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid rgba(176,38,79,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#8B6F66' }}>Subtotal</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#B0264F' }}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            {cartTotal < 999 && (
              <div style={{ background: 'rgba(31,138,76,0.08)', border: '1px solid rgba(31,138,76,0.2)',
                borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#1F8A4C' }}>
                Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free delivery 🚚
              </div>
            )}
            <button onClick={() => { setCartOpen(false); navigate('/checkout') }}
              style={{ padding: '14px 0', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#B0264F,#7A1635)',
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
                  }
