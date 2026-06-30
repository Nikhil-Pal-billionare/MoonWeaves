import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      total_amount,
      user_id,
      user_email,
      shipping_address,
    } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      console.error('Missing RAZORPAY_KEY_SECRET env var')
      return res.status(500).json({ error: 'Payment gateway not configured' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' })
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
      return res.status(500).json({ error: 'Database not configured' })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user_id || null,
        user_email,
        items: cart,
        total_amount,
        razorpay_order_id,
        razorpay_payment_id,
        status: 'confirmed',
        shipping_address,
      })
      .select()
      .single()

    if (error) {
      console.error('Order insert failed:', error)
      return res.status(500).json({ error: 'Payment verified but order save failed' })
    }

    return res.status(200).json({ success: true, orderId: data.id })
  } catch (err) {
    console.error('verify-payment error:', err)
    return res.status(500).json({ error: 'Server error verifying payment' })
  }
        }
