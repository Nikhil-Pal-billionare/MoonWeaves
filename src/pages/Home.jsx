import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, Truck, RefreshCw, Shield } from 'lucide-react'
import { supabase } from '../supabase'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

const categories = [
  { name: 'Silk', emoji: '✨', desc: 'Pure & Kanjivaram' },
  { name: 'Banarasi', emoji: '🏛️', desc: 'Zari & Brocade' },
  { name: 'Cotton', emoji: '🌿', desc: 'Daily Comfort' },
  { name: 'Chiffon', emoji: '🌸', desc: 'Light & Flowy' },
  { name: 'Georgette', emoji: '💫', desc: 'Party Wear' },
  { name: 'Linen', emoji: '🍃', desc: 'Casual Chic' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true)
      .order('created_at', { ascending: false }).limit(8)
      .then(({ data }) => setFeatured(data || []))
  }, [])

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%), #0a0a0f',
        textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage:
          'radial-gradient(circle at 20% 80%, rgba(192,38,211,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,58,237,0.12) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
            background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.25)',
            borderRadius: 40, padding: '6px 16px', fontSize: 13, color: '#c084fc', fontWeight: 500 }}>
            <Sparkles size={14} /> New Collection 2025
          </div>
          <h1 style={{ fontSize: 'clamp(36px,7vw,72px)', fontWeight: 800, lineHeight: 1.1,
            marginBottom: 20, color: '#f0e6ff',
            background: 'linear-gradient(135deg,#e8d5ff 0%,#c084fc 50%,#a855f7 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Wear the Magic<br />of Every Thread
          </h1>
          <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9b73d4', lineHeight: 1.7,
            marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            Discover exquisite handpicked sarees — from timeless silks to contemporary drapes — crafted for the modern Indian woman.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/shop')}
              style={{ padding: '14px 32px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg,#7c3aed,#c026d3)', color: '#fff',
                fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: 8, transition: 'transform 0.2s' }}>
              Shop Now <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/shop?sort=discount')}
              style={{ padding: '14px 32px', borderRadius: 14,
                border: '1px solid rgba(192,132,252,0.4)', background: 'rgba(124,58,237,0.1)',
                color: '#c084fc', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              View Offers
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ background: 'rgba(124,58,237,0.06)', borderTop: '1px solid rgba(139,92,246,0.1)',
        borderBottom: '1px solid rgba(139,92,246,0.1)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {[
            [Truck, 'Free Delivery', 'On orders above ₹999'],
            [RefreshCw, 'Easy Returns', '7 day return policy'],
            [Shield, 'Secure Payment', '100% safe checkout'],
            [Star, 'Authentic', 'Curated ethnic wear'],
          ].map(([Icon, title, sub]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10,
                background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color="#c084fc" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e8d5ff' }}>{title}</div>
                <div style={{ fontSize: 11, color: '#6b5a80' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#e8d5ff', marginBottom: 8 }}>
            Shop by Category
          </h2>
          <p style={{ fontSize: 14, color: '#6b5a80' }}>Find your perfect drape</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
          {categories.map(cat => (
            <div key={cat.name} onClick={() => navigate(`/shop?cat=${cat.name}`)}
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 16, padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(192,132,252,0.5)'
                e.currentTarget.style.background = 'rgba(124,58,237,0.15)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'
                e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{cat.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e8d5ff', marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: 11, color: '#6b5a80' }}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#e8d5ff', marginBottom: 4 }}>
                New Arrivals
              </h2>
              <p style={{ fontSize: 13, color: '#6b5a80' }}>Fresh picks just in</p>
            </div>
            <button onClick={() => navigate('/shop')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none',
                border: '1px solid rgba(192,132,252,0.3)', color: '#c084fc', borderRadius: 10,
                padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        </section>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
