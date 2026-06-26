import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, ArrowLeft, ImagePlus } from 'lucide-react'
import { supabase } from '../../supabase'
import { useAuth } from '../../context/AuthContext'

const FABRICS = ['Silk', 'Banarasi', 'Cotton', 'Chiffon', 'Georgette', 'Linen', 'Crepe', 'Net', 'Organza', 'Pure Crepe']
const OCCASIONS = ['Casual', 'Party', 'Wedding', 'Festival', 'Office', 'Traditional', 'Bridal']
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Teal', 'Multi']

const EMPTY_FORM = {
  name: '', description: '', price: '', mrp: '', discount_percent: '',
  stock: '', fabric: '', occasion: '', color: '', subcategory: '',
  images: [''], is_active: true,
}

const inp = {
  background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.25)',
  color: '#e8d5ff', borderRadius: 10, padding: '10px 12px', fontSize: 13,
  outline: 'none', width: '100%', boxSizing: 'border-box',
}
const sel = { ...inp, cursor: 'pointer' }

export default function AdminProducts() {
  const { isAdmin, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/admin')
  }, [isAdmin, loading])

  useEffect(() => { if (isAdmin) fetchProducts() }, [isAdmin])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  function openNew() {
    setForm(EMPTY_FORM); setEditId(null); setShowForm(true)
  }

  function openEdit(p) {
    setForm({
      name: p.name || '', description: p.description || '',
      price: p.price || '', mrp: p.mrp || '',
      discount_percent: p.discount_percent || '',
      stock: p.stock || '', fabric: p.fabric || '',
      occasion: p.occasion || '', color: p.color || '',
      subcategory: p.subcategory || '',
      images: p.images?.length ? p.images : [''],
      is_active: p.is_active ?? true,
    })
    setEditId(p.id); setShowForm(true)
  }

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function setImage(idx, val) {
    setForm(f => {
      const imgs = [...f.images]
      imgs[idx] = val
      return { ...f, images: imgs }
    })
  }
  function addImageField() { setForm(f => ({ ...f, images: [...f.images, ''] })) }
  function removeImageField(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.stock) {
      alert('Name, Price and Stock are required'); return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : null,
      discount_percent: form.discount_percent ? Number(form.discount_percent)
        : (form.mrp && form.price ? Math.round((1 - Number(form.price) / Number(form.mrp)) * 100) : null),
      stock: Number(form.stock),
      fabric: form.fabric || null,
      occasion: form.occasion || null,
      color: form.color || null,
      subcategory: form.subcategory || null,
      images: form.images.filter(u => u.trim()),
      is_active: form.is_active,
      category: 'Saree',
    }

    if (editId) {
      await supabase.from('products').update(payload).eq('id', editId)
    } else {
      await supabase.from('products').insert(payload)
    }
    setSaving(false); setShowForm(false); fetchProducts()
  }

  async function handleDelete(id) {
    await supabase.from('products').delete().eq('id', id)
    setDeleteConfirm(null); fetchProducts()
  }

  async function toggleActive(p) {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
    fetchProducts()
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.fabric?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Nav */}
      <nav style={{ background: '#0f0b1a', borderBottom: '1px solid rgba(139,92,246,0.2)',
        padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/admin/dashboard" style={{ color: '#9b73d4', display: 'flex', alignItems: 'center', gap: 6,
            textDecoration: 'none', fontSize: 13 }}><ArrowLeft size={16} /> Dashboard</Link>
          <span style={{ color: '#3a2a50' }}>|</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#c084fc' }}>🌙 Products</span>
        </div>
        <button onClick={async () => { await signOut(); navigate('/admin') }}
          style={{ fontSize: 13, color: '#f87171', background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
          Sign Out
        </button>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e8d5ff' }}>Products</h1>
            <p style={{ fontSize: 13, color: '#6b5a80' }}>{products.length} total products</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inp, width: 200 }} />
            <button onClick={openNew}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#c026d3)',
                color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              <Plus size={15} /> Add Product
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div style={{ background: '#120f1e', borderRadius: 16, border: '1px solid rgba(139,92,246,0.2)', overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#6b5a80' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🧵</div>
              <p>No products yet. Add your first product!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
                    {['Product', 'Fabric', 'Price', 'MRP', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6b5a80',
                        fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" style={{ width: 44, height: 56,
                              objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: 44, height: 56, borderRadius: 8,
                              background: 'rgba(124,58,237,0.15)', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', color: '#6b5a80' }}>
                              🧵
                            </div>
                          )}
                          <span style={{ color: '#e8d5ff', fontWeight: 500, maxWidth: 200,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#9b73d4' }}>{p.fabric || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#c084fc', fontWeight: 600 }}>
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b5a80' }}>
                        {p.mrp ? `₹${Number(p.mrp).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ color: p.stock > 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => toggleActive(p)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                            fontSize: 11, fontWeight: 600,
                            color: p.is_active ? '#4ade80' : '#f87171',
                            background: p.is_active ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)' }}>
                          {p.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                          {p.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(p)}
                            style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                              background: 'rgba(124,58,237,0.15)', color: '#c084fc',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(p.id)}
                            style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                              background: 'rgba(239,68,68,0.1)', color: '#f87171',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 5000 }}
            onClick={() => setDeleteConfirm(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 5001, background: '#120f1e', borderRadius: 16, padding: 28, maxWidth: 360,
            width: '90%', border: '1px solid rgba(239,68,68,0.3)', textAlign: 'center' }}>
            <Trash2 size={32} color="#f87171" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e8d5ff', marginBottom: 8 }}>Delete Product?</h3>
            <p style={{ fontSize: 13, color: '#9b73d4', marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10,
                  border: '1px solid rgba(139,92,246,0.3)', background: 'transparent',
                  color: '#c084fc', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                  background: 'rgba(239,68,68,0.8)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 5000 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 5001,
            width: '100%', maxWidth: 540, background: '#0f0b1a',
            borderLeft: '1px solid rgba(139,92,246,0.3)', overflowY: 'auto', padding: 28 }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e8d5ff' }}>
                {editId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: '#9b73d4', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 6 }}>
                  Product Name <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input value={form.name} onChange={e => setField('name', e.target.value)}
                  placeholder="e.g. Kanjivaram Pure Silk Saree" style={inp} />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={e => setField('description', e.target.value)}
                  placeholder="Describe the saree..." rows={3}
                  style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              {/* Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  ['price', 'Price (₹) *', 'Selling price'],
                  ['mrp', 'MRP (₹)', 'Original price'],
                  ['stock', 'Stock *', 'Qty available'],
                ].map(([k, label, ph]) => (
                  <div key={k}>
                    <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input type="number" value={form[k]} onChange={e => setField(k, e.target.value)}
                      placeholder={ph} style={inp} />
                  </div>
                ))}
              </div>

              {/* Fabric & Occasion */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 6 }}>Fabric</label>
                  <select value={form.fabric} onChange={e => setField('fabric', e.target.value)} style={sel}>
                    <option value="">Select fabric</option>
                    {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 6 }}>Occasion</label>
                  <select value={form.occasion} onChange={e => setField('occasion', e.target.value)} style={sel}>
                    <option value="">Select occasion</option>
                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 6 }}>Color</label>
                  <select value={form.color} onChange={e => setField('color', e.target.value)} style={sel}>
                    <option value="">Select color</option>
                    {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 6 }}>Sub-category</label>
                  <input value={form.subcategory} onChange={e => setField('subcategory', e.target.value)}
                    placeholder="e.g. Pure Silk" style={inp} />
                </div>
              </div>

              {/* Images */}
              <div>
                <label style={{ fontSize: 12, color: '#9b73d4', display: 'block', marginBottom: 8 }}>
                  Product Image URLs
                </label>
                {form.images.map((url, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={url} onChange={e => setImage(idx, e.target.value)}
                      placeholder={`Image URL ${idx + 1}`} style={{ ...inp, flex: 1 }} />
                    {form.images.length > 1 && (
                      <button onClick={() => removeImageField(idx)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171',
                          borderRadius: 8, padding: '0 10px', cursor: 'pointer' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addImageField}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#c084fc',
                    background: 'rgba(124,58,237,0.1)', border: '1px dashed rgba(192,132,252,0.3)',
                    borderRadius: 8, padding: '8px 14px', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                  <ImagePlus size={14} /> Add Another Image URL
                </button>
                <p style={{ fontSize: 11, color: '#4a3a60', marginTop: 8 }}>
                  💡 Upload images to Supabase Storage or use any image hosting URL
                </p>
              </div>

              {/* Active Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(124,58,237,0.08)', borderRadius: 10, padding: '14px 16px' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#e8d5ff', fontWeight: 500 }}>Product Visibility</div>
                  <div style={{ fontSize: 11, color: '#6b5a80', marginTop: 2 }}>
                    {form.is_active ? 'Visible to customers' : 'Hidden from customers'}
                  </div>
                </div>
                <button onClick={() => setField('is_active', !form.is_active)}
                  style={{ width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                    background: form.is_active ? '#7c3aed' : '#2a1f3a',
                    position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3,
                    left: form.is_active ? 23 : 3, transition: 'left 0.2s' }} />
                </button>
              </div>

              {/* Save */}
              <button onClick={handleSave} disabled={saving}
                style={{ padding: '13px 0', borderRadius: 12, border: 'none',
                  background: saving ? '#3b1f6b' : 'linear-gradient(135deg,#7c3aed,#c026d3)',
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Save size={16} /> {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
                                         }
