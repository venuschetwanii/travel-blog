import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const BATTLES = [
  {
    a: { name: 'Jaipur', cost: '$28/day' },
    b: { name: 'Udaipur', cost: '$42/day' },
    winner: 'a'
  },
  {
    a: { name: 'Budapest', cost: '$38/day' },
    b: { name: 'Prague', cost: '$46/day' },
    winner: 'a'
  },
  {
    a: { name: 'Goa', cost: '$34/day' },
    b: { name: 'Phuket', cost: '$52/day' },
    winner: 'a'
  }
];

const parseCost = (str) => parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;

export default function BudgetBattleSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="bb-section" ref={ref}>
      <div className="bb-inner">
        <motion.div
          className="bb-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="bb-eyebrow">
            <span className="bb-eyebrow-line" />
            Budget Battle
            <span className="bb-eyebrow-line" />
          </p>
          <h2 className="bb-headline">
            Which destination wins
            <br />
            <em>per dollar?</em>
          </h2>
        </motion.div>

        <div className="bb-grid">
          {BATTLES.map((battle, i) => {
            const savings = parseCost(battle.b.cost) - parseCost(battle.a.cost);
            return (
              <motion.article
                key={`${battle.a.name}-${battle.b.name}`}
                className="bb-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="bb-vs-strip">
                  <div className={`bb-dest ${battle.winner === 'a' ? 'bb-dest--win' : ''}`}>
                    <span className="bb-dest-name">{battle.a.name}</span>
                    <span className="bb-dest-cost">{battle.a.cost}</span>
                    {battle.winner === 'a' ? <span className="bb-winner-tag">✓ Winner</span> : null}
                  </div>
                  <div className="bb-vs-badge">VS</div>
                  <div className={`bb-dest ${battle.winner === 'b' ? 'bb-dest--win' : ''}`}>
                    <span className="bb-dest-name">{battle.b.name}</span>
                    <span className="bb-dest-cost">{battle.b.cost}</span>
                    {battle.winner === 'b' ? <span className="bb-winner-tag">✓ Winner</span> : null}
                  </div>
                </div>

                <div className="bb-savings">
                  <span className="bb-savings-label">You save</span>
                  <span className="bb-savings-amount">
                    ${Math.abs(savings)}/day
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
