import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const authorPhoto =
  '/images/author-pawan.jpg';

export default function AuthorSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const navigate = useNavigate();

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
            <img src={authorPhoto} alt="Pawan Prajapati - BudgetFriendly Author" className="author-photo" />
            <div className="author-photo-ring" />
            <div className="author-badge">6 years on the road</div>
          </div>
        </motion.div>

        <div className="author-content-col">
          <motion.p className="author-eyebrow" {...fadeUp(0.2)}>
            Meet the Author
          </motion.p>

          <motion.h2 className="author-name" {...fadeUp(0.3)}>
            Hi, I&apos;m <em>Pawan</em>
          </motion.h2>

          <motion.p className="author-bio" {...fadeUp(0.4)}>
            I&apos;m not just a traveler, I&apos;m someone who found life on the
            roads, and this platform shares that same ground-level travel truth.
          </motion.p>

          <motion.button
            type="button"
            className="author-cta"
            {...fadeUp(0.5)}
            onClick={() => navigate('/about')}
          >
            Read Full Story
            <span className="btn-arrow">-&gt;</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

