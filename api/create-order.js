export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      console.error('Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars')
      return res.status(500).json({ error: 'Payment gateway not configured' })
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects paise
        currency: 'INR',
        receipt: 'rcpt_' + Date.now(),
      }),
    })

    const data = await rzpRes.json()

    if (!rzpRes.ok) {
      console.error('Razorpay order creation failed:', data)
      return res.status(rzpRes.status).json({ error: data.error?.description || 'Order creation failed' })
    }

    return res.status(200).json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
    })
  } catch (err) {
    console.error('create-order error:', err)
    return res.status(500).json({ error: 'Server error creating order' })
  }
}
