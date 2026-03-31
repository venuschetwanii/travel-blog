import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const BATTLES = [
  {
    a: { name: 'Jaipur', cost: 1800 },
    b: { name: 'Udaipur', cost: 2400 },
    winner: 'a',
    basis: 'Dorm bed + local meals + city transport'
  },
  {
    a: { name: 'Rishikesh', cost: 1500 },
    b: { name: 'Manali', cost: 2300 },
    winner: 'a',
    basis: 'Guesthouse stay + local meals + local commute'
  },
  {
    a: { name: 'Varanasi', cost: 1400 },
    b: { name: 'Goa', cost: 2800 },
    winner: 'a',
    basis: 'Guesthouse dorm + local food + transport'
  }
];

const inr = new Intl.NumberFormat('en-IN');
const formatCost = (cost) => {
  if (cost >= 1000) return `₹${(cost / 1000).toFixed(1)}k/day`;
  return `₹${inr.format(cost)}/day`;
};

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
            <em>per rupee?</em>
          </h2>
        </motion.div>

        <div className="bb-grid">
          {BATTLES.map((battle, i) => {
            const savings = battle.b.cost - battle.a.cost;
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
                    <span className="bb-dest-cost">{formatCost(battle.a.cost)}</span>
                    {battle.winner === 'a' ? <span className="bb-winner-tag">Winner</span> : null}
                  </div>
                  <div className="bb-vs-badge">VS</div>
                  <div className={`bb-dest ${battle.winner === 'b' ? 'bb-dest--win' : ''}`}>
                    <span className="bb-dest-name">{battle.b.name}</span>
                    <span className="bb-dest-cost">{formatCost(battle.b.cost)}</span>
                    {battle.winner === 'b' ? <span className="bb-winner-tag">Winner</span> : null}
                  </div>
                </div>

                <div className="bb-savings">
                  <span className="bb-savings-label">You save</span>
                  <span className="bb-savings-amount">₹{inr.format(Math.abs(savings))}/day</span>
                </div>

                <p className="bb-basis">{battle.basis}</p>
              </motion.article>
            );
          })}
        </div>

        <p className="bb-footnote">
          Conservative solo-travel estimates. Includes stay, food, and local transport. Excludes flights, visas,
          shopping, and premium activities.
        </p>
      </div>
    </section>
  );
}
