import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryFilter({ tabs, active, onChange, counts = {} }) {
  return (
    <div className="category-filter">
      {tabs.map((tab) => (
        <button key={tab} type="button" className={active === tab ? 'active' : ''} onClick={() => onChange(tab)}>
          {tab} <span>({counts[tab] || 0})</span>
        </button>
      ))}
      <motion.span className="indicator" layoutId="tab-indicator" />
    </div>
  );
}
