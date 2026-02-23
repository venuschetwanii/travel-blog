import React from 'react';
import { motion } from 'framer-motion';

const floatItems = [
  { label: 'India', cls: 'f1' },
  { label: 'Europe', cls: 'f2' },
  { label: 'Hostel', cls: 'f3' },
  { label: 'Food', cls: 'f4' },
  { label: 'Route', cls: 'f5' },
  { label: 'Backpack', cls: 'f6' }
];

export default function ScrollWordsSection({ guideCount = 0, destinationCount = 0, routeCount = 0 }) {
  const lines = [
    `${guideCount.toLocaleString()} guides`,
    `${destinationCount.toLocaleString()} destinations`,
    `${routeCount.toLocaleString()} routes`
  ];

  return (
    <section className="scroll-words-showcase">
      {floatItems.map((item) => (
        <motion.div
          key={item.label}
          className={`float-pill ${item.cls}`}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5 + (item.label.length % 3), repeat: Infinity, ease: 'easeInOut' }}
        >
          {item.label}
        </motion.div>
      ))}

      <div className="words-inner">
        <p>A growing library of</p>
        {lines.map((line, idx) => (
          <motion.h3
            key={line}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ duration: 0.45, delay: idx * 0.15 }}
          >
            {line}
          </motion.h3>
        ))}
      </div>
    </section>
  );
}
