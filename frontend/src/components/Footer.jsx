import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Journal', sectionId: 'all-blogs' },
  { label: 'Featured', sectionId: 'featured' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Admin', to: '/admin' }
];

const socials = [
  { label: 'Twitter', href: 'https://x.com' },
  { label: 'Instagram', href: 'https://www.instagram.com' },
  { label: 'YouTube', href: 'https://www.youtube.com' }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goToSection = (sectionId) => {
    if (pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate(`/#${sectionId}`);
  };

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
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="footer-social" aria-label={s.label} target="_blank" rel="noreferrer">
                {s.label[0]}
              </a>
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
            {footerLinks.map((item) => (
              item.sectionId ? (
                <button
                  key={item.label}
                  type="button"
                  className="footer-link footer-link-btn"
                  onClick={() => goToSection(item.sectionId)}
                >
                  {item.label}
                </button>
              ) : (
                <Link key={item.label} to={item.to} className="footer-link">
                  {item.label}
                </Link>
              )
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
