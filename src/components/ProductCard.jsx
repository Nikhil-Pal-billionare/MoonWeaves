import { useState } from 'react'
import { Heart, Star, Truck } from 'lucide-react'

const s = {
  card: {
    background: '#FFFFFF', borderRadius: 6, overflow: 'hidden',
    border: '1px solid #E5E5E5', cursor: 'pointer',
    transition: 'box-shadow 0.15s',
  },
  imgWrap: { position: 'relative', paddingTop: '125%', overflow: 'hidden', background: '#F5F5F6' },
  img: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  wishBtn: {
    position: 'absolute', top: 8, right: 8,
    background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
    color: '#6B1E83', padding: 6, borderRadius: '50%', display: 'flex',
    alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
  },
  info: { padding: '10px 10px 12px' },
  name: { fontSize: 13, color: '#282C3F', fontWeight: 500, lineHeight: 1.35,
    marginBottom: 5, display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 35 },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  price: { fontSize: 15, fontWeight: 700, color: '#282C3F' },
  mrp: { fontSize: 12, color: '#9C9C9C', textDecoration: 'line-through' },
  off: { fontSize: 12, color: '#03A685', fontWeight: 600 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  ratingBadge: { display: 'flex', alignItems: 'center', gap: 2, background: '#03A685',
    color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 5px', borderRadius: 3 },
  ratingCount: { fontSize: 11, color: '#9C9C9C' },
  delivery: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#535766' },
  outOfStock: {
    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#282C3F',
  },
}

export default function ProductCard({ product, onClick }) {
  const [wished, setWished] = useState(false)

  const img = product.images?.[0] || 'https://placehold.co/400x500/F5F5F6/6B1E83?text=MoonWeaver'
  const discount = product.discount_percent || (product.mrp && product.price
    ? Math.round((1 - product.price / product.mrp) * 100) : 0)
  const rating = product.rating || 4.1
  const ratingCount = product.rating_count || Math.floor(Math.random() * 800 + 50)

  return (
    <div style={s.card} onClick={onClick}>
      <div style={s.imgWrap}>
        <img src={img} alt={product.name} style={s.img} />
        <button style={s.wishBtn} onClick={e => { e.stopPropagation(); setWished(!wished) }}>
          <Heart size={14} fill={wished ? '#6B1E83' : 'none'} color="#6B1E83" />
        </button>
        {product.stock === 0 && <div style={s.outOfStock}>Out of Stock</div>}
      </div>

      <div style={s.info}>
        <div style={s.name}>{product.name}</div>

        <div style={s.priceRow}>
          <span style={s.price}>₹{product.price?.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <>
              <span style={s.mrp}>₹{product.mrp?.toLocaleString('en-IN')}</span>
              {discount > 0 && <span style={s.off}>{discount}% off</span>}
            </>
          )}
        </div>

        <div style={s.ratingRow}>
          <span style={s.ratingBadge}>{rating.toFixed ? rating.toFixed(1) : rating} <Star size={9} fill="#fff" /></span>
          <span style={s.ratingCount}>{ratingCount}</span>
        </div>

        <div style={s.delivery}>
          <Truck size={12} /> Free Delivery
        </div>
      </div>
    </div>
  )
}
