import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#FFFFFF', borderTop: '1px solid #E5E5E5',
      padding: '40px 24px 20px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#6B1E83', marginBottom: 10 }}>MoonWeaver</div>
            <p style={{ fontSize: 12.5, color: '#686B78', lineHeight: 1.7 }}>
              Premium ethnic sarees and traditional wear, curated for the modern Indian woman.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#282C3F', textTransform: 'uppercase',
              letterSpacing: 0.6, marginBottom: 12 }}>Shop</h4>
            {['Silk Sarees', 'Banarasi', 'Cotton Sarees', 'Chiffon Sarees', 'Party Wear'].map(link => (
              <div key={link} style={{ marginBottom: 8 }}>
                <Link to={`/shop?cat=${link}`} style={{ fontSize: 12.5, color: '#686B78', textDecoration: 'none' }}>
                  {link}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#282C3F', textTransform: 'uppercase',
              letterSpacing: 0.6, marginBottom: 12 }}>Help</h4>
            {['Size Guide', 'Returns & Exchange', 'Shipping Info', 'Contact Us', 'FAQs'].map(link => (
              <div key={link} style={{ marginBottom: 8 }}>
                <a href="#" style={{ fontSize: 12.5, color: '#686B78', textDecoration: 'none' }}>{link}</a>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#282C3F', textTransform: 'uppercase',
              letterSpacing: 0.6, marginBottom: 12 }}>We Accept</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['UPI', 'Cards', 'Net Banking', 'Wallets', 'EMI', 'COD'].map(p => (
                <span key={p} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20,
                  background: '#F5F5F6', border: '1px solid #E5E5E5',
                  color: '#535766' }}>{p}</span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#9C9C9C', marginTop: 14 }}>
              Powered by <span style={{ color: '#6B1E83', fontWeight: 600 }}>Razorpay</span> - 100% secure payments
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#9C9C9C' }}>© 2026 MoonWeaver. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use'].map(t => (
              <a key={t} href="#" style={{ fontSize: 12, color: '#9C9C9C', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
