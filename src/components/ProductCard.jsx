import { useState } from 'react'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const s = {
  card: {
    background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    border: '1px solid rgba(176,38,79,0.15)', cursor: 'pointer',
    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
  },
  imgWrap: { position: 'relative', paddingTop: '130%', overflow: 'hidden', background: '#FBEAE3' },
  img: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
    transition: 'transform 0.4s' },
  badge: {
    position: 'absolute', top: 10, left: 10,
    background: 'linear-gradient(135deg,#B0264F,#7A1635)',
    color: '#fff', fontSize: 11, fontWeight: 700,
    padding: '3px 8px', borderRadius: 20,
  },
  wishBtn: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(10,10,15,0.7)', border: 'none', cursor: 'pointer',
    color: '#B0264F', padding: 6, borderRadius: 8, display: 'flex',
    alignItems: 'center', backdropFilter: 'blur(8px)',
  },
  info: { padding: '14px 14px 16px' },
  brand: { fontSize: 11, color: '#8B6F66', fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 4 },
  name: { fontSize: 13, color: '#241016', fontWeight: 500, lineHeight: 1.4,
    marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  priceRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  price: { fontSize: 16, fontWeight: 700, color: '#B0264F' },
  mrp: { fontSize: 12, color: '#9C8983', textDecoration: 'line-through' },
  off: { fontSize: 11, color: '#1F8A4C', fontWeight: 600 },
  addBtn: {
    width: '100%', padding: '9px 0', borderRadius: 10,
    background: 'linear-gradient(135deg,#B0264F,#7A1635)',
    color: '#fff', border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 600, display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: 6,
    transition: 'opacity 0.2s',
  },
  outOfStock: {
    width: '100%', padding: '9px 0', borderRadius: 10,
    background: '#F2E3DD', color: '#9C8983', border: 'none',
    fontSize: 13, fontWeight: 600,
  },
}

export default function ProductCard({ product, onClick }) {
  const { addToCart } = useCart()
  const [wished, setWished] = useState(false)
  const [hover, setHover] = useState(false)

  const img = product.images?.[0] || 'https://placehold.co/400x520/FBEAE3/B0264F?text=MoonWeaver'
  const discount = product.discount_percent || (product.mrp && product.price
    ? Math.round((1 - product.price / product.mrp) * 100) : 0)

  return (
    <div
      style={{ ...s.card, transform: hover ? 'translateY(-4px)' : 'none',
        borderColor: hover ? 'rgba(176,38,79,0.4)' : 'rgba(176,38,79,0.15)',
        boxShadow: hover ? '0 12px 40px rgba(176,38,79,0.2)' : 'none' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={s.imgWrap} onClick={onClick}>
        <img src={img} alt={product.name} style={{ ...s.img, transform: hover ? 'scale(1.05)' : 'scale(1)' }} />
        {discount > 0 && <span style={s.badge}>{discount}% OFF</span>}
        <button style={s.wishBtn} onClick={e => { e.stopPropagation(); setWished(!wished) }}>
          <Heart size={15} fill={wished ? '#B0264F' : 'none'} />
        </button>
      </div>

      <div style={s.info}>
        <div style={s.brand}>{product.fabric || product.subcategory || 'Ethnic Wear'}</div>
        <div style={s.name} onClick={onClick}>{product.name}</div>

        <div style={s.priceRow}>
          <span style={s.price}>₹{product.price?.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <>
              <span style={s.mrp}>₹{product.mrp?.toLocaleString('en-IN')}</span>
              {discount > 0 && <span style={s.off}>({discount}% off)</span>}
            </>
          )}
        </div>

        {product.stock > 0 ? (
          <button style={s.addBtn} onClick={e => { e.stopPropagation(); addToCart(product) }}>
            <ShoppingBag size={14} /> Add to Bag
          </button>
        ) : (
          <button style={s.outOfStock} disabled>Out of Stock</button>
        )}
      </div>
    </div>
  )
}
