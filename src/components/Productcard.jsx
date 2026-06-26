import { useState, useEffect } from 'react'
import { X, ShoppingBag, Heart, ChevronLeft, ChevronRight, Truck, RefreshCw, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
  zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 16, backdropFilter: 'blur(4px)',
}
const modal = {
  background: '#120f1e', borderRadius: 20, width: '100%', maxWidth: 900,
  maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(139,92,246,0.3)',
  display: 'flex', flexWrap: 'wrap',
}

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart()
  const [imgIdx, setImgIdx] = useState(0)
  const [wished, setWished] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const images = product.images?.length ? product.images : ['https://placehold.co/600x780/12082a/c084fc?text=MoonWeaver']
  const discount = product.discount_percent || (product.mrp && product.price
    ? Math.round((1 - product.price / product.mrp) * 100) : 0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleAdd() {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const details = [
    ['Fabric', product.fabric],
    ['Occasion', product.occasion],
    ['Color', product.color],
    ['Category', product.subcategory || product.category],
    ['Stock', product.stock > 0 ? `${product.stock} available` : 'Out of stock'],
  ].filter(([, v]) => v)

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>

        {/* Image Section */}
        <div style={{ flex: '1 1 340px', position: 'relative', minHeight: 400, background: '#1a1530' }}>
          <img src={images[imgIdx]} alt={product.name}
            style={{ width: '100%', height: '100%', minHeight: 400, objectFit: 'cover', borderRadius: '20px 0 0 20px' }} />

          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(10,10,15,0.7)', border: 'none', color: '#c084fc',
                  cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(10,10,15,0.7)', border: 'none', color: '#c084fc',
                  cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                <ChevronRight size={18} />
              </button>
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 6 }}>
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ width: i === imgIdx ? 20 : 6, height: 6, borderRadius: 3,
                      background: i === imgIdx ? '#c084fc' : 'rgba(192,132,252,0.4)',
                      border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            </>
          )}

          {discount > 0 && (
            <div style={{ position: 'absolute', top: 14, left: 14,
              background: 'linear-gradient(135deg,#7c3aed,#c026d3)',
              color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Info Section */}
        <div style={{ flex: '1 1 320px', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: '#9b73d4', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: 0.8, marginBottom: 6 }}>
                {product.fabric || 'Ethnic Wear'}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8d5ff', lineHeight: 1.3 }}>
                {product.name}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setWished(!wished)}
                style={{ background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.3)',
                  color: '#c084fc', cursor: 'pointer', padding: 8, borderRadius: 10 }}>
                <Heart size={18} fill={wished ? '#c084fc' : 'none'} />
              </button>
              <button onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#9b73d4', cursor: 'pointer', padding: 8, borderRadius: 10 }}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#c084fc' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span style={{ fontSize: 16, color: '#6b5a80', textDecoration: 'line-through' }}>
                  ₹{product.mrp?.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 600 }}>({discount}% off)</span>
              </>
            )}
          </div>

          {product.description && (
            <p style={{ fontSize: 14, color: '#b39dcc', lineHeight: 1.7 }}>{product.description}</p>
          )}

          {details.length > 0 && (
            <div style={{ background: 'rgba(124,58,237,0.08)', borderRadius: 12, padding: 16,
              border: '1px solid rgba(139,92,246,0.15)' }}>
              {details.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0', borderBottom: '1px solid rgba(139,92,246,0.08)',
                  fontSize: 13 }}>
                  <span style={{ color: '#9b73d4' }}>{k}</span>
                  <span style={{ color: '#e8d5ff', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#9b73d4' }}>Qty:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(124,58,237,0.1)', borderRadius: 10, padding: '6px 14px' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>−</button>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#e8d5ff', minWidth: 24, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>+</button>
            </div>
          </div>

          {product.stock > 0 ? (
            <button onClick={handleAdd}
              style={{ padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: added ? '#4ade80' : 'linear-gradient(135deg,#7c3aed,#c026d3)',
                color: added ? '#0a0a0f' : '#fff', fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.3s' }}>
              <ShoppingBag size={18} />
              {added ? 'Added to Bag!' : 'Add to Bag'}
            </button>
          ) : (
            <button disabled style={{ padding: '14px 0', borderRadius: 12, border: 'none',
              background: '#2a1f3a', color: '#6b5a80', fontSize: 15, fontWeight: 700 }}>
              Out of Stock
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
            {[
              [Truck, 'Free delivery on orders above ₹999'],
              [RefreshCw, '7 day easy returns & exchange'],
              [Shield, '100% authentic products'],
            ].map(([Icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#9b73d4' }}>
                <Icon size={14} style={{ color: '#c084fc', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
            }
