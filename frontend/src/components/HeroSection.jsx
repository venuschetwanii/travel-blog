import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.65 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }
});

export default function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const heroBg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80';
  const heroVideo = '/videos/landing-bg.mp4';
  const [videoError, setVideoError] = useState(false);

  const goToListing = () => {
    const section = document.getElementById('all-blogs');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate('/#all-blogs');
  };

  const handleSearch = () => {
    if (!query.trim()) {
      goToListing();
      return;
    }
    navigate('/#all-blogs');
  };

  return (
    <section className="hero-section">
      <div className="hero-kb-wrap" aria-hidden="true">
        {!videoError ? (
          <video
            className="hero-kb-video"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroBg}
            onError={() => setVideoError(true)}
          />
        ) : (
          <div className="hero-kb-img" style={{ backgroundImage: `url(${heroBg})` }} />
        )}
        <div className="hero-kb-grade" />
        <div className="hero-kb-vignette" />
        <div className="hero-kb-overlay" />
      </div>

      <div className="hero-content-container">
        <motion.h1 className="hero-headline" {...fadeUp(0.1)}>
          Discover the world
          <br />
          <em>without breaking</em>
          <br />
          the bank.
        </motion.h1>

        <motion.div className="hero-cta-group" {...fadeUp(0.25)}>
          <button type="button" className="btn-primary" onClick={goToListing}>
            Explore Stories
            <span className="btn-arrow">→</span>
          </button>
        </motion.div>

        <motion.div className="hero-search-bar" {...fadeUp(0.4)}>
          <input
            type="text"
            placeholder="Search destinations, budgets, tips..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button type="button" onClick={handleSearch}>Search →</button>
        </motion.div>

        <motion.div className="hero-scroll-cue" {...fadeUp(0.55)}>
          <span />
        </motion.div>
      </div>
    </section>
  );
}
