import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, CheckCircle, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const STEPS = ['Bag Review', 'Delivery Address', 'Payment']

const inputStyle = {
  background: 'rgba(107,30,131,0.08)', border: '1px solid rgba(107,30,131,0.25)',
  color: '#282C3F', borderRadius: 10, padding: '12px 14px', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function Checkout() {
  const { cart, cartTotal, clearCart, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [paying, setPaying] = useState(false)
  const [orderDone, setOrderDone] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [addr, setAddr] = useState({
    name: '', phone: '', email: user?.email || '',
    line1: '', line2: '', city: '', state: '', pincode: ''
  })

  const delivery = cartTotal >= 999 ? 0 : 99
  const grandTotal = cartTotal + delivery

  function updateAddr(field, val) {
    setAddr(prev => ({ ...prev, [field]: val }))
  }

  function validateAddr() {
    const required = ['name', 'phone', 'email', 'line1', 'city', 'state', 'pincode']
    return required.every(f => addr[f].trim())
  }

  async function createRazorpayOrder() {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: grandTotal }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Could not create order')
    return data
  }

  async function handlePayment() {
    if (!window.Razorpay) {
      alert('Razorpay failed to load. Please refresh and try again.')
      return
    }
    setPaying(true)

    try {
      const rzpOrder = await createRazorpayOrder()

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'MoonWeaver',
        description: `${cart.length} item(s)`,
        order_id: rzpOrder.id,
        prefill: {
          name: addr.name,
          email: addr.email,
          contact: addr.phone,
        },
        theme: { color: '#6B1E83' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart: cart.map(i => ({
                  id: i.id, name: i.name, price: i.price,
                  qty: i.qty, image: i.images?.[0] || null
                })),
                total_amount: grandTotal,
                user_id: user?.id || null,
                user_email: addr.email,
                shipping_address: addr,
              }),
            })
            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              alert(verifyData.error || 'Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id)
              setPaying(false)
              return
            }

            setOrderId(verifyData.orderId)
            clearCart()
            setOrderDone(true)
          } catch (e) {
            console.error(e)
            alert('Payment succeeded but order confirmation failed. Please contact support with your payment ID: ' + response.razorpay_payment_id)
          }
          setPaying(false)
        },
        modal: {
          ondismiss: () => setPaying(false)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.')
        setPaying(false)
      })
      rzp.open()
    } catch (e) {
      console.error(e)
      alert(e.message || 'Something went wrong. Please try again.')
      setPaying(false)
    }
  }

  if (orderDone) {
    return (
      <div style={{ paddingTop: 104, minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(3,166,133,0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="#03A685" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#282C3F', marginBottom: 10 }}>
            Order Confirmed! 🎉
          </h2>
          <p style={{ fontSize: 15, color: '#686B78', lineHeight: 1.7, marginBottom: 8 }}>
            Thank you, <strong style={{ color: '#6B1E83' }}>{addr.name}</strong>! Your order has been placed successfully.
          </p>
          {orderId && (
            <p style={{ fontSize: 12, color: '#9C9C9C', marginBottom: 24 }}>
              Order ID: <span style={{ color: '#686B78', fontFamily: 'monospace' }}>{orderId.slice(0, 8)}...</span>
            </p>
          )}
          <p style={{ fontSize: 13, color: '#9C9C9C', marginBottom: 32 }}>
            A confirmation will be sent to <strong style={{ color: '#6B1E83' }}>{addr.email}</strong>
          </p>
          <button onClick={() => navigate('/shop')}
            style={{ padding: '13px 32px', borderRadius: 12, border: 'none',
              background: '#6B1E83',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: 104, minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🛍️</div>
        <h3 style={{ fontSize: 20, color: '#686B78' }}>Your bag is empty</h3>
        <button onClick={() => navigate('/shop')}
          style={{ padding: '12px 28px', borderRadius: 12, border: 'none',
            background: '#6B1E83',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Shop Now
        </button>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 104, minHeight: '100vh', padding: '80px 24px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#282C3F', marginBottom: 8 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                  background: i <= step ? '#6B1E83' : 'rgba(107,30,131,0.1)',
                  color: i <= step ? '#fff' : '#9C9C9C',
                  border: i <= step ? 'none' : '1px solid rgba(107,30,131,0.2)' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, color: i <= step ? '#6B1E83' : '#9C9C9C', fontWeight: i === step ? 600 : 400,
                  display: window.innerWidth < 480 ? 'none' : 'block' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < step ? 'rgba(107,30,131,0.4)' : 'rgba(107,30,131,0.15)',
                  margin: '0 10px' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 24, alignItems: 'start' }}>
          {/* Left Panel */}
          <div>
            {/* Step 0: Bag Review */}
            {step === 0 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(107,30,131,0.2)', overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(107,30,131,0.15)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#282C3F' }}>Your Bag ({cart.length} items)</h3>
                </div>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 14, padding: '16px 20px',
                    borderBottom: '1px solid rgba(107,30,131,0.08)' }}>
                    <img src={item.images?.[0] || 'https://placehold.co/70x90/F5F5F6/6B1E83?text=M'}
                      alt={item.name} style={{ width: 60, height: 78, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, color: '#282C3F', fontWeight: 500, marginBottom: 4, lineHeight: 1.4 }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: 12, color: '#686B78', marginBottom: 8 }}>Qty: {item.qty}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#6B1E83' }}>
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div style={{ padding: '16px 20px' }}>
                  <button onClick={() => setStep(1)}
                    style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
                      background: '#6B1E83',
                      color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Continue to Address
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(107,30,131,0.2)', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <MapPin size={18} color="#6B1E83" />
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#282C3F' }}>Delivery Address</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    ['name', 'Full Name', 'text', true],
                    ['phone', 'Phone Number', 'tel', true],
                    ['email', 'Email Address', 'email', true],
                    ['pincode', 'PIN Code', 'text', true],
                    ['line1', 'Address Line 1', 'text', true],
                    ['line2', 'Address Line 2 (Optional)', 'text', false],
                    ['city', 'City', 'text', true],
                    ['state', 'State', 'text', true],
                  ].map(([field, label, type, req]) => (
                    <div key={field} style={{ gridColumn: ['line1', 'line2'].includes(field) ? 'span 2' : 'span 1' }}>
                      <label style={{ fontSize: 12, color: '#686B78', display: 'block', marginBottom: 6 }}>
                        {label} {req && <span style={{ color: '#DC2626' }}>*</span>}
                      </label>
                      <input type={type} value={addr[field]} onChange={e => updateAddr(field, e.target.value)}
                        style={inputStyle} placeholder={label} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button onClick={() => setStep(0)}
                    style={{ flex: 1, padding: '12px 0', borderRadius: 12,
                      border: '1px solid rgba(107,30,131,0.3)', background: 'transparent',
                      color: '#6B1E83', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Back
                  </button>
                  <button onClick={() => validateAddr() ? setStep(2) : alert('Please fill all required fields')}
                    style={{ flex: 2, padding: '12px 0', borderRadius: 12, border: 'none',
                      background: '#6B1E83',
                      color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(107,30,131,0.2)', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <CreditCard size={18} color="#6B1E83" />
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#282C3F' }}>Payment</h3>
                </div>

                <div style={{ background: 'rgba(3,166,133,0.06)', border: '1px solid rgba(3,166,133,0.2)',
                  borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#03A685', marginBottom: 6 }}>
                    ✓ Delivering to
                  </div>
                  <div style={{ fontSize: 13, color: '#535766', lineHeight: 1.6 }}>
                    {addr.name} · {addr.phone}<br />
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                    {addr.city}, {addr.state} - {addr.pincode}
                  </div>
                </div>

                <div style={{ background: 'rgba(107,30,131,0.08)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: '#686B78', marginBottom: 8 }}>Powered by Razorpay</div>
                  <div style={{ fontSize: 12, color: '#9C9C9C', lineHeight: 1.6 }}>
                    ✓ UPI · ✓ Credit/Debit Cards · ✓ Net Banking · ✓ Wallets · ✓ EMI
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(1)}
                    style={{ flex: 1, padding: '12px 0', borderRadius: 12,
                      border: '1px solid rgba(107,30,131,0.3)', background: 'transparent',
                      color: '#6B1E83', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Back
                  </button>
                  <button onClick={handlePayment} disabled={paying}
                    style={{ flex: 2, padding: '13px 0', borderRadius: 12, border: 'none',
                      background: paying ? '#CCCCCC' : '#6B1E83',
                      color: '#fff', fontSize: 14, fontWeight: 700,
                      cursor: paying ? 'not-allowed' : 'pointer' }}>
                    {paying ? 'Processing...' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(107,30,131,0.2)',
            padding: 20, position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#282C3F', marginBottom: 16 }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between',
                marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: '#686B78', flex: 1, marginRight: 8 }}>
                  {item.name.length > 28 ? item.name.slice(0, 28) + '...' : item.name} x {item.qty}
                </span>
                <span style={{ color: '#282C3F', fontWeight: 500, flexShrink: 0 }}>
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(107,30,131,0.15)', paddingTop: 14, marginTop: 6 }}>
              {[
                ['Subtotal', `₹${cartTotal.toLocaleString('en-IN')}`],
                ['Delivery', delivery === 0 ? 'FREE 🎉' : `₹${delivery}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#686B78' }}>{k}</span>
                  <span style={{ color: v === 'FREE 🎉' ? '#03A685' : '#282C3F' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                borderTop: '1px solid rgba(107,30,131,0.15)', paddingTop: 12, marginTop: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#282C3F' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#6B1E83' }}>
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            {delivery > 0 && (
              <div style={{ marginTop: 12, fontSize: 11, color: '#9C9C9C', textAlign: 'center' }}>
                Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free delivery
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
      }
