import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

const FALLBACK_CARDS = [
  { image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', destination: 'Jaipur, India', category: 'Asia', budget: '$12/day' },
  { image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80', destination: 'Ubud, Bali', category: 'Asia', budget: '$18/day' },
  { image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80', destination: 'Tokyo, Japan', category: 'Asia', budget: '$45/day' },
  { image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', destination: 'Paris, France', category: 'Europe', budget: '$60/day' },
  { image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80', destination: 'Santorini, Greece', category: 'Europe', budget: '$55/day' }
];

export default function CardFanSection() {
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [hovered, setHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/blogs?limit=5&published=true')
      .then((res) => {
        const blogs = res.data?.blogs || res.data?.data || res.data || [];
        if (Array.isArray(blogs) && blogs.length >= 3) {
          const mapped = blogs.slice(0, 5).map((b, i) => ({
            image: b?.image ? `http://localhost:5000${b.image}` : FALLBACK_CARDS[i % FALLBACK_CARDS.length].image,
            destination: b?.title || FALLBACK_CARDS[i % FALLBACK_CARDS.length].destination,
            category: b?.category || FALLBACK_CARDS[i % FALLBACK_CARDS.length].category,
            budget: (Array.isArray(b?.tags) && b.tags[0]) || 'Budget Travel',
            slug: b?.slug
          }));
          while (mapped.length < 5) mapped.push(FALLBACK_CARDS[mapped.length]);
          setCards(mapped);
        }
      })
      .catch(() => setCards(FALLBACK_CARDS));
  }, []);

  const getFanStyle = (index, total) => {
    const mid = Math.floor(total / 2);
    const offset = index - mid;
    return {
      rotate: offset * 8,
      x: offset * 30,
      y: Math.abs(offset) * 12,
      zIndex: total - Math.abs(offset)
    };
  };

  const getHoverStyle = (index, total) => {
    const mid = Math.floor(total / 2);
    const offset = index - mid;
    return {
      rotate: offset * 20,
      x: offset * 90,
      y: Math.abs(offset) * 20,
      zIndex: total - Math.abs(offset)
    };
  };

  return (
    <section className="fan-section" ref={ref}>
      <div className="fan-wave-top">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none">
          <path d="M0,28 C480,56 960,0 1440,28 L1440,0 L0,0 Z" fill="var(--cream)" />
        </svg>
      </div>

      <div className="fan-inner">
        <motion.div
          className="fan-content"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="fan-eyebrow">
            <span className="fan-eyebrow-dot" />
            From the road
          </p>

          <h2 className="fan-headline">
            Destinations
            <br />
            <em>worth every</em>
            <br />
            rupee.
          </h2>

          <p className="fan-body">
            Real places. Real budgets. No sponsored hotels,
            no fake "luxury for less." Just honest guides
            from someone who actually stayed there.
          </p>

          <motion.button
            className="fan-cta"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { window.location.href = '/#all-blogs'; }}
            type="button"
          >
            Explore All Guides
            <span className="fan-cta-arrow">→</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="fan-stage-wrapper"
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="fan-hover-hint">
            <span className="hint-dot" />
            Hover to explore
          </p>

          <div
            className="fan-stage"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setActiveCard(null); }}
          >
            {cards.map((card, i) => {
              const base = getFanStyle(i, cards.length);
              const hover = getHoverStyle(i, cards.length);
              const style = hovered ? hover : base;
              const isActive = activeCard === i;

              return (
                <motion.div
                  key={`${card.destination}-${i}`}
                  className={`fan-card ${isActive ? 'fan-card--active' : ''}`}
                  animate={{
                    rotate: style.rotate,
                    x: style.x,
                    y: isActive ? style.y - 30 : style.y,
                    scale: isActive ? 1.06 : 1,
                    zIndex: isActive ? 99 : style.zIndex
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 22,
                    delay: hovered ? i * 0.04 : 0
                  }}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
                  onClick={() => card.slug && (window.location.href = `/blog/${card.slug}`)}
                >
                  <div className="fan-card-img-wrap">
                    <img
                      src={card.image}
                      alt={card.destination}
                      className="fan-card-img"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_CARDS[i % FALLBACK_CARDS.length].image;
                      }}
                    />
                  </div>

                  <div className="fan-card-overlay">
                    <div className="fan-card-meta">
                      <span className="fan-card-category">{card.category}</span>
                      <strong className="fan-card-title">{card.destination}</strong>
                      <span className="fan-card-budget">{card.budget}</span>
                    </div>
                  </div>

                  <div className="fan-card-shine" />
                </motion.div>
              );
            })}

            <div className={`fan-shadow ${hovered ? 'fan-shadow--spread' : ''}`} />
          </div>

          <div className="fan-dots">
            {cards.map((_, i) => (
              <div
                key={`dot-${i}`}
                className={`fan-dot ${activeCard === i ? 'fan-dot--active' : ''}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="fan-wave-bottom">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none">
          <path d="M0,28 C480,0 960,56 1440,28 L1440,56 L0,56 Z" fill="var(--cream)" />
        </svg>
      </div>
    </section>
  );
}
