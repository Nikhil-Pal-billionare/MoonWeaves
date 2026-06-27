import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#241016', borderTop: '1px solid rgba(176,38,79,0.15)',
      padding: '48px 24px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#B0264F', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>🌙 MoonWeaver</div>
            <p style={{ fontSize: 13, color: '#9C8983', lineHeight: 1.7 }}>
              Premium ethnic sarees and traditional wear, curated for the modern Indian woman.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8B6F66', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 14 }}>Shop</h4>
            {['Silk Sarees', 'Banarasi', 'Cotton Sarees', 'Chiffon Sarees', 'Party Wear'].map(link => (
              <div key={link} style={{ marginBottom: 8 }}>
                <Link to={`/shop?cat=${link}`} style={{ fontSize: 13, color: '#9C8983', textDecoration: 'none' }}>
                  {link}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8B6F66', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 14 }}>Help</h4>
            {['Size Guide', 'Returns & Exchange', 'Shipping Info', 'Contact Us', 'FAQs'].map(link => (
              <div key={link} style={{ marginBottom: 8 }}>
                <a href="#" style={{ fontSize: 13, color: '#9C8983', textDecoration: 'none' }}>{link}</a>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8B6F66', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 14 }}>We Accept</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['UPI', 'Cards', 'Net Banking', 'Wallets', 'EMI', 'COD'].map(p => (
                <span key={p} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(176,38,79,0.1)', border: '1px solid rgba(176,38,79,0.2)',
                  color: '#8B6F66' }}>{p}</span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#9C8983', marginTop: 16 }}>
              Powered by <span style={{ color: '#B0264F' }}>Razorpay</span> — 100% secure payments
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(176,38,79,0.1)', paddingTop: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#C9ADA8' }}>© 2025 MoonWeaver. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use'].map(t => (
              <a key={t} href="#" style={{ fontSize: 12, color: '#C9ADA8', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
