import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { supabase } from '../supabase'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

const FABRICS = ['Silk', 'Banarasi', 'Cotton', 'Chiffon', 'Georgette', 'Linen', 'Crepe', 'Net']
const OCCASIONS = ['Casual', 'Party', 'Wedding', 'Festival', 'Office', 'Traditional']
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Biggest Discount', value: 'discount' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [fabric, setFabric] = useState(searchParams.get('cat') || '')
  const [occasion, setOccasion] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('products').select('*').eq('is_active', true)

    if (search) q = q.ilike('name', `%${search}%`)
    if (fabric) q = q.ilike('fabric', `%${fabric}%`)
    if (occasion) q = q.ilike('occasion', `%${occasion}%`)
    if (minPrice) q = q.gte('price', Number(minPrice))
    if (maxPrice) q = q.lte('price', Number(maxPrice))

    switch (sort) {
      case 'price_asc': q = q.order('price', { ascending: true }); break
      case 'price_desc': q = q.order('price', { ascending: false }); break
      case 'discount': q = q.order('discount_percent', { ascending: false }); break
      default: q = q.order('created_at', { ascending: false })
    }

    const { data } = await q
    setProducts(data || [])
    setLoading(false)
  }, [search, fabric, occasion, minPrice, maxPrice, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function clearFilters() {
    setSearch(''); setFabric(''); setOccasion('')
    setMinPrice(''); setMaxPrice(''); setSort('newest')
  }

  const hasFilters = search || fabric || occasion || minPrice || maxPrice || sort !== 'newest'

  const inputStyle = {
    background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.25)',
    color: '#e8d5ff', borderRadius: 10, padding: '10px 14px', fontSize: 13,
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      {/* Shop Header */}
      <div style={{ background: 'rgba(124,58,237,0.06)', borderBottom: '1px solid rgba(139,92,246,0.15)',
        padding: '24px', position: 'sticky', top: 64, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: '#9b73d4' }} />
              <input placeholder="Search sarees..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 38 }} />
            </div>

            {/* Sort */}
            <div style={{ position: 'relative' }}>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ ...inputStyle, paddingRight: 32, appearance: 'none', cursor: 'pointer', minWidth: 160 }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%',
                transform: 'translateY(-50%)', color: '#9b73d4', pointerEvents: 'none' }} />
            </div>

            {/* Filter Toggle */}
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                borderRadius: 10, border: '1px solid rgba(139,92,246,0.3)',
                background: filtersOpen ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.08)',
                color: '#c084fc', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <SlidersHorizontal size={15} /> Filters
              {hasFilters && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc' }} />}
            </button>

            {hasFilters && (
              <button onClick={clearFilters}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
                  borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.08)', color: '#f87171',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <X size={14} /> Clear All
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {filtersOpen && (
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ fontSize: 11, color: '#9b73d4', marginBottom: 6, display: 'block',
                  textTransform: 'uppercase', letterSpacing: 0.5 }}>Fabric Type</label>
                <select value={fabric} onChange={e => setFabric(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">All Fabrics</option>
                  {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ fontSize: 11, color: '#9b73d4', marginBottom: 6, display: 'block',
                  textTransform: 'uppercase', letterSpacing: 0.5 }}>Occasion</label>
                <select value={occasion} onChange={e => setOccasion(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">All Occasions</option>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ fontSize: 11, color: '#9b73d4', marginBottom: 6, display: 'block',
                  textTransform: 'uppercase', letterSpacing: 0.5 }}>Min Price (₹)</label>
                <input type="number" placeholder="0" value={minPrice}
                  onChange={e => setMinPrice(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ fontSize: 11, color: '#9b73d4', marginBottom: 6, display: 'block',
                  textTransform: 'uppercase', letterSpacing: 0.5 }}>Max Price (₹)</label>
                <input type="number" placeholder="50000" value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)} style={inputStyle} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} style={{ background: '#120f1e', borderRadius: 16, height: 380,
                border: '1px solid rgba(139,92,246,0.1)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#6b5a80' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧵</div>
            <h3 style={{ fontSize: 20, color: '#9b73d4', marginBottom: 8 }}>No products found</h3>
            <p style={{ fontSize: 14 }}>Try adjusting your filters or search term</p>
            <button onClick={clearFilters}
              style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#7c3aed,#c026d3)', color: '#fff',
                cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#6b5a80', marginBottom: 20 }}>
              {products.length} products found
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          </>
        )}
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
