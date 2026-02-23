import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const authorPhoto = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80';

export default function AuthorSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }
  });

  return (
    <section className="author-section" ref={ref}>
      <div className="author-wave-top" />

      <div className="author-container">
        <motion.div className="author-photo-col" {...fadeUp(0.1)}>
          <div className="author-photo-frame">
            <img
              src={authorPhoto}
              alt="Arjun - BudgetFriendly Author"
              className="author-photo"
            />
            <div className="author-photo-ring" />
            <div className="author-badge">✈️ 6 yrs on the road</div>
          </div>
        </motion.div>

        <div className="author-content-col">
          <motion.p className="author-eyebrow" {...fadeUp(0.2)}>Meet the Author</motion.p>

          <motion.h2 className="author-name" {...fadeUp(0.3)}>
            Hi, I&apos;m <em>Arjun</em>
          </motion.h2>

          <motion.p className="author-bio" {...fadeUp(0.4)}>
            I travel with a low budget, document every expense, and turn
            each trip into practical guides you can actually use. My goal
            is simple: help you travel farther without burning cash.
          </motion.p>

          <motion.div className="author-stats" {...fadeUp(0.5)}>
            <div className="author-stat">
              <span className="stat-number">18+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="author-stat-divider" />
            <div className="author-stat">
              <span className="stat-number">$32</span>
              <span className="stat-label">Avg Daily Budget</span>
            </div>
            <div className="author-stat-divider" />
            <div className="author-stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Years Backpacking</span>
            </div>
          </motion.div>

          <motion.button
            type="button"
            className="author-cta"
            {...fadeUp(0.6)}
            onClick={() => {
              const section = document.getElementById('all-blogs');
              if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Explore My Budget Guides
            <span className="btn-arrow">→</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
