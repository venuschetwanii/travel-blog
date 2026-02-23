import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

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
  const bgOptions = useMemo(() => ([
    { id: 'image', label: 'Image' },
    { id: 'video-1', label: 'Video 1', src: '/videos/hero-option-1.mp4' },
    { id: 'video-2', label: 'Video 2', src: '/videos/hero-option-2.mp4' },
    { id: 'video-3', label: 'Video 3', src: '/videos/hero-option-3.mp4' },
    { id: 'video-4', label: 'Video 4', src: '/videos/hero-option-4.mp4' }
  ]), []);
  const [activeBg, setActiveBg] = useState(() => localStorage.getItem('hero-bg-choice') || 'image');
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    localStorage.setItem('hero-bg-choice', activeBg);
  }, [activeBg]);

  useEffect(() => {
    setVideoError(false);
  }, [activeBg]);

  const selectedOption = bgOptions.find((opt) => opt.id === activeBg) || bgOptions[0];
  const useVideo = Boolean(selectedOption.src) && !videoError;

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
        {useVideo ? (
          <video
            className="hero-kb-video"
            src={selectedOption.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
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
        <div className="hero-bg-switcher" role="group" aria-label="Background preview options">
          {bgOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={opt.id === activeBg ? 'active' : ''}
              onClick={() => setActiveBg(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

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
