import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useRef } from 'react';

const authorPhoto =
  '/images/author-pawan.jpg';

const storySections = [
  {
    title: 'How It Started',
    tag: 'Origin',
    icon: '🚲',
    paragraphs: [
      "Hello, I'm Pawan Prajapati.",
      "I am not just a traveler. I am someone who found life on the road.",
      'I come from a small city near Nashik, close to Panchavati. Growing up there, I always felt there was something bigger than routine life.',
      'I discovered that feeling in 8th standard — one bicycle, a curious heart, riding toward the hills near Nashik and Igatpuri.',
      'Those simple rides changed everything. Nature became my teacher.'
    ]
  },
  {
    title: 'Why This Website Exists',
    tag: 'Purpose',
    icon: '🎒',
    paragraphs: [
      'Today, many people feel trapped between corporate pressure, family responsibilities, and personal stress.',
      "Somewhere between earning and expectations, people forget to live for themselves. And the biggest myth: 'Travel needs a lot of money.' No. Travel needs courage."
    ],
    bullets: [
      'General train compartments. Real India.',
      'Complete trips with one backpack.',
      'Lifts from strangers.',
      "Conversations in languages I didn't speak."
    ],
    quote: 'In those moments, I found something priceless: connection.'
  },
  {
    title: 'My Travel Style',
    tag: 'Philosophy',
    icon: '🏔️',
    paragraphs: [
      'Weekend dekho. Backpack karo. Jo train mile, usme chadh jao.',
      'Real travel does not happen in five-star hotels. It happens on railway platforms, village roads, mountain trails, and in conversations with strangers.'
    ],
    bullets: [
      'Solo backpacking',
      'Spiritual destinations',
      'Mountains & trekking',
      'Meeting local people and their traditions'
    ]
  },
  {
    title: "What You'll Find Here",
    tag: 'Content',
    icon: '📍',
    paragraphs: [
      "This platform is for every solo traveler who dreams but thinks, 'Budget kam hai...'",
      'Here I share practical content from real trips — not luxury show-off travel.'
    ],
    bullets: [
      'Real experiences',
      'Money-saving travel lessons',
      'Mistakes to avoid',
      'Ground-level stories & vlogs'
    ],
    quote: 'Not luxury travel. Not show-off travel. Real travel.'
  },
  {
    title: 'A Message For You',
    tag: 'For You',
    icon: '✨',
    paragraphs: [
      'If you are tired, stuck, or overwhelmed by responsibilities — another world is waiting.',
      'Pack your bag. Step outside. Trust yourself.',
      'You might not only find new places. You might find a new version of yourself.'
    ]
  }
];

function StoryBlock({ section, idx }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 });

  return (
    <motion.div
      ref={ref}
      className="story-block"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="story-left">
        <span className="story-num">{String(idx + 1).padStart(2, '0')}</span>
        <div className="story-line" />
      </div>

      <div className="story-content">
        <div className="story-header">
          <span className="story-tag">{section.tag}</span>
          <span className="story-icon">{section.icon}</span>
        </div>
        <h3 className="story-title">{section.title}</h3>

        {section.paragraphs.map((p, i) => (
          <p className="story-para" key={i}>{p}</p>
        ))}

        {section.bullets && (
          <ul className="story-bullets">
            {section.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}

        {section.quote && (
          <blockquote className="story-quote">{section.quote}</blockquote>
        )}
      </div>
    </motion.div>
  );
}

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [photoRef, photoInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --clay:   #C17B4A;
          --earth:  #8B5A2B;
          --sand:   #F5ECD7;
          --bark:   #2A1A0E;
          --fog:    #E8DDD0;
          --moss:   #4A5E3A;
          --sky:    #7BAFC4;
          --ink:    #1A120A;
          --cream:  #FBF7F0;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: var(--cream); }

        /* ───── HERO ───── */
        .ab-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: var(--bark);
        }

        .ab-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 60% 40%, rgba(193,123,74,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 20% 80%, rgba(74,94,58,0.22) 0%, transparent 60%),
            var(--bark);
        }

        .ab-hero-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.45;
        }

        .ab-hero-photo-wrap {
          position: absolute; inset: 0;
          display: flex; align-items: stretch;
        }

        .ab-hero-photo {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 20%;
          opacity: 0.28;
          mix-blend-mode: luminosity;
        }

        .ab-hero-content {
          position: relative; z-index: 2;
          padding: clamp(2rem, 8vw, 6rem);
          padding-bottom: clamp(3rem, 10vw, 8rem);
          max-width: 900px;
        }

        .ab-kicker {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em;
          color: var(--clay);
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .ab-kicker::before {
          content: '';
          display: block; width: 28px; height: 1px;
          background: var(--clay);
        }

        .ab-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 900;
          line-height: 0.95;
          color: var(--sand);
          margin-bottom: 2rem;
        }

        .ab-h1 em {
          font-style: italic;
          color: var(--clay);
        }

        .ab-hero-lead {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-weight: 300;
          color: rgba(245,236,215,0.65);
          max-width: 520px;
          line-height: 1.7;
          border-left: 2px solid var(--clay);
          padding-left: 1.2rem;
        }

        .ab-scroll-hint {
          position: absolute;
          bottom: 2.5rem; right: clamp(2rem, 6vw, 5rem);
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          color: rgba(245,236,215,0.35);
          text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
          writing-mode: vertical-rl;
          z-index: 3;
        }

        /* ───── INTRO STRIP ───── */
        .ab-intro-strip {
          background: var(--clay);
          padding: 2rem clamp(2rem, 8vw, 6rem);
          display: flex; align-items: center;
          gap: 2rem; flex-wrap: wrap;
        }

        .ab-intro-strip p {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: var(--sand);
          flex: 1; min-width: 240px;
        }

        .ab-stat-row {
          display: flex; gap: 2rem; flex-wrap: wrap;
        }

        .ab-stat { text-align: center; }

        .ab-stat strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--bark);
          line-height: 1;
        }

        .ab-stat span {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(42,26,14,0.6);
        }

        /* ───── MAIN BODY ───── */
        .ab-body {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem);
          align-items: start;
        }

        @media (max-width: 860px) {
          .ab-body { grid-template-columns: 1fr; }
          .ab-sidebar { display: none; }
          .ab-sidebar-mobile { display: block !important; }
        }

        /* ───── SIDEBAR ───── */
        .ab-sidebar {
          position: sticky; top: 2rem;
          padding-right: 3rem;
        }

        .ab-sidebar-mobile { display: none; margin-bottom: 3rem; }

        .ab-profile-photo-wrap {
          position: relative;
          width: 180px; height: 220px;
          margin-bottom: 1.5rem;
        }

        .ab-profile-frame {
          position: absolute;
          top: 10px; left: 10px;
          width: 100%; height: 100%;
          border: 2px solid var(--clay);
          border-radius: 2px;
        }

        .ab-profile-photo {
          position: relative; z-index: 1;
          width: 100%; height: 100%;
          object-fit: cover;
          border-radius: 2px;
          filter: sepia(20%) contrast(1.05);
        }

        .ab-profile-badge {
          position: absolute;
          bottom: -12px; right: -12px;
          z-index: 2;
          background: var(--bark);
          color: var(--clay);
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 6px 10px;
        }

        .ab-profile-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 700;
          color: var(--bark);
          margin-bottom: 0.4rem;
          margin-top: 1rem;
        }

        .ab-profile-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--clay);
          margin-bottom: 1rem;
        }

        .ab-profile-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; line-height: 1.65;
          color: rgba(26,18,10,0.65);
          margin-bottom: 1.5rem;
        }

        .ab-chips {
          display: flex; flex-direction: column; gap: 6px;
          margin-bottom: 2rem;
        }

        .ab-chip {
          display: flex; align-items: center; gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.06em;
          color: var(--earth);
        }

        .ab-chip::before {
          content: '→';
          color: var(--clay);
        }

        .ab-sidebar-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--cream);
          background: var(--bark);
          padding: 0.75rem 1.25rem;
          text-decoration: none;
          transition: background 0.25s, gap 0.25s;
        }

        .ab-sidebar-cta:hover {
          background: var(--clay);
          gap: 14px;
        }

        /* ───── STORY BLOCKS ───── */
        .story-block {
          display: flex; gap: 2rem;
          margin-bottom: 4rem;
          align-items: flex-start;
        }

        .story-left {
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
          flex-shrink: 0;
          padding-top: 4px;
        }

        .story-num {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.1em;
          color: var(--clay);
          white-space: nowrap;
        }

        .story-line {
          width: 1px; flex: 1;
          background: linear-gradient(to bottom, var(--clay), transparent);
          min-height: 60px; margin-top: 8px;
        }

        .story-content { flex: 1; }

        .story-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 0.6rem;
        }

        .story-tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--moss);
          background: rgba(74,94,58,0.1);
          padding: 3px 10px;
        }

        .story-icon { font-size: 1.2rem; }

        .story-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700;
          color: var(--bark);
          margin-bottom: 1rem;
          line-height: 1.15;
        }

        .story-para {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem; line-height: 1.8;
          color: rgba(26,18,10,0.7);
          margin-bottom: 0.75rem;
        }

        .story-bullets {
          list-style: none;
          margin: 1rem 0 1.2rem;
          display: flex; flex-direction: column; gap: 0.5rem;
        }

        .story-bullets li {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; line-height: 1.6;
          color: rgba(26,18,10,0.7);
          display: flex; align-items: flex-start; gap: 10px;
          padding: 0.5rem 0.8rem;
          border-left: 2px solid var(--fog);
          background: rgba(245,236,215,0.4);
        }

        .story-bullets li::before {
          content: '—';
          color: var(--clay); flex-shrink: 0;
          font-family: 'DM Mono', monospace;
        }

        .story-quote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1.1rem, 2.2vw, 1.4rem);
          color: var(--clay);
          margin: 1.5rem 0 0;
          padding: 1.2rem 1.5rem;
          border-left: 3px solid var(--clay);
          background: rgba(193,123,74,0.06);
        }

        /* ───── DIVIDER ───── */
        .ab-divider {
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1.5rem, 5vw, 3rem);
        }

        .ab-divider hr {
          border: none;
          border-top: 1px solid var(--fog);
        }

        /* ───── FOOTER CTA ───── */
        .ab-footer-cta {
          background: var(--bark);
          padding: clamp(4rem, 10vw, 8rem) clamp(2rem, 8vw, 6rem);
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 2rem;
          position: relative; overflow: hidden;
        }

        .ab-footer-cta::before {
          content: 'TRAVEL';
          position: absolute;
          font-family: 'Playfair Display', serif;
          font-size: clamp(6rem, 20vw, 16rem);
          font-weight: 900;
          color: rgba(193,123,74,0.05);
          right: -2rem; bottom: -1rem;
          line-height: 1; pointer-events: none;
        }

        .ab-footer-text {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1.5rem, 4vw, 2.8rem);
          color: var(--sand);
          max-width: 520px;
          line-height: 1.25;
        }

        .ab-footer-text em { color: var(--clay); font-style: normal; }

        .ab-footer-cta-link {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--clay);
          text-decoration: none;
          border: 1px solid rgba(193,123,74,0.4);
          padding: 1rem 1.75rem;
          transition: all 0.3s;
          position: relative; z-index: 1;
        }

        .ab-footer-cta-link:hover {
          background: var(--clay);
          color: var(--bark);
          border-color: var(--clay);
          gap: 18px;
        }
      `}</style>

      {/* HERO */}
      <section className="ab-hero" ref={heroRef}>
        <div className="ab-hero-bg" />
        <div className="ab-hero-grain" />
        <motion.div className="ab-hero-photo-wrap" style={{ y: parallaxY }}>
          <img src={authorPhoto} alt="" className="ab-hero-photo" aria-hidden />
        </motion.div>

        <motion.div className="ab-hero-content" style={{ opacity: heroOpacity }}>
          <motion.p
            className="ab-kicker"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Behind BudgetFriendly
          </motion.p>

          <motion.h1
            className="ab-h1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Built on local<br />
            trains, <em>mountain<br />
            roads,</em> and real<br />
            budgets.
          </motion.h1>

          <motion.p
            className="ab-hero-lead"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Not a brand pitch. The full story of why this platform exists — and who it is for.
          </motion.p>
        </motion.div>

        <p className="ab-scroll-hint">Scroll</p>
      </section>

      {/* INTRO STRIP */}
      <div className="ab-intro-strip">
        <p>"Zindagi sirf weekends mein nahi, raaste mein bhi milti hai."</p>
        <div className="ab-stat-row">
          {[['8th', 'Standard'], ['1', 'Bicycle'], ['∞', 'Stories']].map(([num, label]) => (
            <div className="ab-stat" key={label}>
              <strong>{num}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="ab-body">

        {/* SIDEBAR */}
        <aside className="ab-sidebar">
          <div className="ab-profile-photo-wrap">
            <div className="ab-profile-frame" />
            <img src={authorPhoto} alt="Pawan Prajapati" className="ab-profile-photo" />
            <span className="ab-profile-badge">Budget Traveler</span>
          </div>
          <h2 className="ab-profile-name">Pawan Prajapati</h2>
          <p className="ab-profile-role">Travel Creator · Nashik</p>
          <p className="ab-profile-bio">
            A ground-level traveler sharing practical, road-tested travel methods from real journeys — not sponsored luxury trips.
          </p>
          <div className="ab-chips">
            {['General class routes', 'Solo backpack planning', 'Ground-level local guides'].map(f => (
              <span className="ab-chip" key={f}>{f}</span>
            ))}
          </div>
          <Link to="/#all-blogs" className="ab-sidebar-cta">
            Explore Guides <span>→</span>
          </Link>
        </aside>

        {/* NARRATIVE */}
        <div>
          {/* Mobile sidebar */}
          <div className="ab-sidebar-mobile">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
              <img src={authorPhoto} alt="Pawan" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 2, filter: 'sepia(20%)' }} />
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--bark)' }}>Pawan Prajapati</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--clay)', marginTop: 4 }}>Travel Creator · Nashik</p>
              </div>
            </div>
          </div>

          {storySections.map((section, idx) => (
            <StoryBlock key={section.title} section={section} idx={idx} />
          ))}
        </div>
      </div>

      {/* FOOTER CTA */}
      <section className="ab-footer-cta">
        <p className="ab-footer-text">
          Start your own<br />
          budget travel <em>chapter.</em>
        </p>
        <Link to="/#all-blogs" className="ab-footer-cta-link">
          Read Dispatches <span>→</span>
        </Link>
      </section>
    </>
  );
}
