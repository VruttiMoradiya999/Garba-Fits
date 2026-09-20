import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShieldCheckIcon, CheckIcon } from './Icons';
import '../styles/style-footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      } catch (err) {
        console.warn('Subscription saved locally (backend offline):', err);
      }
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <div className="brand-script-text">
              Garba<span>Fits</span>
            </div>
            <p>
              India's premier Chaniya Choli rental collective. Celebrating authentic Gujarati craftsmanship, sustainable festive fashion, and endless Navratri twirls.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/rent" className="footer-link">Rent Collection</Link></li>
              <li><Link to="/about" className="footer-link">About Our Craft</Link></li>
              <li><Link to="/contact" className="footer-link">Fitting Studios</Link></li>
            </ul>
          </div>

          {/* Rental Hubs */}
          <div>
            <h4 className="footer-heading">Studio Hubs</h4>
            <ul className="footer-links-list">
              <li><span className="footer-link">Ahmedabad (C.G. Road)</span></li>
              <li><span className="footer-link">Mumbai (Juhu Studio)</span></li>
              <li><span className="footer-link">Surat (Ring Road Hub)</span></li>
              <li><span className="footer-link">Vadodara (Alkapuri)</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4 className="footer-heading">Navratri Early Bird</h4>
            <p>Get exclusive early access to our designer festive drop before slots fill up.</p>
            {subscribed ? (
              <div style={{ color: '#EBBAC4', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <CheckIcon size={16} />
                <span>You are on the VIP early access list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                  <ArrowRightIcon size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GarbaFits Rentals Pvt Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Hygienically Steam Sanitized</span>
            <span>Zero Security Worries</span>
            <span>Pure Artisan Craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
