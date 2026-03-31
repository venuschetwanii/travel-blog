import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

function LogoSVG({ scrolled }) {
  return (
    <div className="logo-lockup">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="logo-plane-icon" aria-hidden="true">
        <path d="M3 18L21 4L17 21L9 16L3 18Z" fill="#E8871A" />
        <path d="M9 16L11 23L15 19L9 16Z" fill="#E8871A" opacity="0.6" />
        <circle cx="23.5" cy="9" r="1" fill="#E8871A" opacity="0.5" />
        <circle cx="25" cy="6" r="0.7" fill="#E8871A" opacity="0.3" />
      </svg>

      <span className="logo-text">
        <span className={`logo-budget ${scrolled ? 'scrolled' : 'hero'}`}>Budget</span>
        <em className="logo-friendly">Friendly</em>
      </span>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Featured', sectionId: 'featured' },
    { label: 'Blog', to: '/blogs' },
    { label: 'About', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Admin', to: '/admin' }
  ];

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
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isHome ? 'navbar--hero' : 'navbar--page'}`}>
        <Link to="/" className="navbar-logo" aria-label="BudgetFriendly Home">
          <LogoSVG scrolled={scrolled || !isHome} />
        </Link>

        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.sectionId || link.to}>
              {link.sectionId ? (
                <button
                  type="button"
                  className="navbar-link navbar-link-btn"
                  onClick={() => goToSection(link.sectionId)}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  to={link.to}
                  className={`navbar-link ${pathname === link.to ? 'navbar-link--active' : ''}`}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            className="navbar-search-btn"
            aria-label="Search"
            type="button"
            onClick={() => goToSection('all-blogs')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="navbar-cta navbar-cta-btn" onClick={() => goToSection('all-blogs')}>
            Write for Us
            <span className="navbar-cta-arrow">↗</span>
          </button>
        </div>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          type="button"
        >
          <span className={menuOpen ? 'bar bar--open bar--top' : 'bar'} />
          <span className={menuOpen ? 'bar bar--open bar--mid' : 'bar'} />
          <span className={menuOpen ? 'bar bar--open bar--bot' : 'bar'} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.sectionId || link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                {link.sectionId ? (
                  <button
                    type="button"
                    className="mobile-link mobile-link-btn"
                    onClick={() => {
                      goToSection(link.sectionId);
                      setMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.to}
                    className="mobile-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
