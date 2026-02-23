import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 18L21 4L17 21L9 16L3 18Z" fill="#E8871A" />
              <path d="M9 16L11 23L15 19L9 16Z" fill="#E8871A" opacity="0.6" />
            </svg>
            <span>Budget<em>Friendly</em></span>
          </div>
          <p className="footer-tagline">
            Travel stories and practical itineraries for explorers who spend wisely.
          </p>
          <div className="footer-socials">
            {['Twitter', 'Instagram', 'YouTube'].map((s) => (
              <a key={s} href="/" className="footer-social" aria-label={s}>{s[0]}</a>
            ))}
          </div>
        </div>

        <div className="footer-newsletter">
          <p className="footer-col-title">New routes in your inbox</p>
          <p className="footer-newsletter-sub">
            No spam. Just honest travel guides when we publish.
          </p>
          <div className="footer-newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <button type="button">Subscribe →</button>
          </div>
        </div>

        <div className="footer-links-col">
          <p className="footer-col-title">Navigate</p>
          <nav className="footer-links">
            {['Home', 'Journal', 'Featured', 'FAQ', 'Admin'].map((l) => (
              <a key={l} href="/" className="footer-link">{l}</a>
            ))}
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 BudgetFriendly. Made for smarter travel planning.</span>
        <span>Built with ✈️ on the road</span>
      </div>
    </footer>
  );
}
