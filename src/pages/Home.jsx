import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Truck, RefreshCw, Shield, BadgePercent } from 'lucide-react'
import { supabase } from '../supabase'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

const categories = [
  { name: 'Silk', emoji: '✨' },
  { name: 'Banarasi', emoji: '🏛️' },
  { name: 'Cotton', emoji: '🌿' },
  { name: 'Chiffon', emoji: '🌸' },
  { name: 'Georgette', emoji: '💫' },
  { name: 'Linen', emoji: '🍃' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true)
      .order('created_at', { ascending: false }).limit(12)
      .then(({ data }) => setFeatured(data || []))
  }, [])

  return (
    <div style={{ paddingTop: 104, background: '#F5F5F6' }}>

      {/* Banner */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 12px 0' }}>
        <div style={{
          background: 'linear-gradient(120deg,#6B1E83,#9B3FB8)',
          borderRadius: 8, padding: '36px 32px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#F0D9F7', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
              NEW SEASON SALE
            </div>
            <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              Sarees starting ₹399
            </h1>
            <p style={{ fontSize: 13, color: '#F0D9F7' }}>Free delivery on orders above ₹999</p>
          </div>
          <button onClick={() => navigate('/shop')}
            style={{ padding: '12px 28px', borderRadius: 6, border: 'none',
              background: '#fff', color: '#6B1E83', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            Shop Now <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 12px 0' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', padding: '14px 0' }}>
          {[
            [Truck, 'Free Delivery'],
            [RefreshCw, '7 Day Returns'],
            [Shield, 'Secure Payment'],
            [BadgePercent, 'Best Prices'],
          ].map(([Icon, title]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon size={16} color="#6B1E83" />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#282C3F' }}>{title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 12px 0' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: '20px 12px' }}>
          <div style={{ display: 'flex', gap: 24, overflowX: 'auto', justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <div key={cat.name} onClick={() => navigate(`/shop?cat=${cat.name}`)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer', width: 84 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F5F5F6',
                  border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 26 }}>
                  {cat.emoji}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#282C3F', textAlign: 'center' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 12px 60px' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: '16px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#282C3F' }}>Trending Now</h2>
              <button onClick={() => navigate('/shop')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none',
                  border: 'none', color: '#6B1E83', cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}>
                View All <ArrowRight size={13} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
              {featured.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  )
              }
