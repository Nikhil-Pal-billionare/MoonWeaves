import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, IndianRupee, TrendingUp, LogOut, Plus, Eye } from 'lucide-react'
import { supabase } from '../../supabase'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { signOut, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 })
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/admin')
  }, [isAdmin, loading])

  useEffect(() => {
    async function load() {
      const [{ count: products }, { data: ordersData }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      ])

      const revenue = ordersData?.filter(o => o.status === 'confirmed')
        .reduce((s, o) => s + o.total_amount, 0) || 0
      const pending = ordersData?.filter(o => o.status === 'pending').length || 0

      setStats({ products: products || 0, orders: ordersData?.length || 0, revenue, pending })
      setOrders(ordersData || [])
    }
    if (isAdmin) load()
  }, [isAdmin])

  const statCards = [
    { icon: Package, label: 'Active Products', value: stats.products, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.orders, color: '#c026d3', bg: 'rgba(192,38,211,0.12)' },
    { icon: IndianRupee, label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    { icon: TrendingUp, label: 'Pending Orders', value: stats.pending, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  ]

  const statusColor = { confirmed: '#4ade80', pending: '#fb923c', cancelled: '#f87171' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Admin Nav */}
      <nav style={{ background: '#0f0b1a', borderBottom: '1px solid rgba(139,92,246,0.2)',
        padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontSize: 18, fontWeight: 700, color: '#c084fc', textDecoration: 'none' }}>
          🌙 MoonWeaver Admin
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/admin/products"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9b73d4',
              textDecoration: 'none', padding: '6px 14px', borderRadius: 8,
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Package size={14} /> Products
          </Link>
          <button onClick={async () => { await signOut(); navigate('/admin') }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#f87171',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e8d5ff', marginBottom: 8 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#6b5a80', marginBottom: 32 }}>Welcome back! Here's what's happening with MoonWeaver.</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 36 }}>
          {statCards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: '#120f1e', borderRadius: 14,
              border: '1px solid rgba(139,92,246,0.15)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: '#6b5a80' }}>{label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <Link to="/admin/products"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px',
              borderRadius: 12, border: 'none', textDecoration: 'none',
              background: 'linear-gradient(135deg,#7c3aed,#c026d3)',
              color: '#fff', fontSize: 14, fontWeight: 600 }}>
            <Plus size={16} /> Add New Product
          </Link>
          <Link to="/shop" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px',
              borderRadius: 12, border: '1px solid rgba(139,92,246,0.3)', textDecoration: 'none',
              background: 'rgba(124,58,237,0.08)', color: '#c084fc', fontSize: 14, fontWeight: 600 }}>
            <Eye size={16} /> View Store
          </Link>
        </div>

        {/* Recent Orders */}
        <div style={{ background: '#120f1e', borderRadius: 16, border: '1px solid rgba(139,92,246,0.2)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e8d5ff' }}>Recent Orders</h2>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6b5a80' }}>No orders yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                    {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                        color: '#6b5a80', fontWeight: 600, fontSize: 11,
                        textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#9b73d4', fontFamily: 'monospace', fontSize: 12 }}>
                        #{order.id.slice(0, 8)}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#e8d5ff' }}>{order.user_email || 'Guest'}</td>
                      <td style={{ padding: '14px 16px', color: '#9b73d4' }}>{order.items?.length || 0} items</td>
                      <td style={{ padding: '14px 16px', color: '#c084fc', fontWeight: 600 }}>
                        ₹{order.total_amount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          color: statusColor[order.status] || '#9b73d4',
                          background: `${statusColor[order.status] || '#9b73d4'}18`,
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b5a80', fontSize: 12 }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
