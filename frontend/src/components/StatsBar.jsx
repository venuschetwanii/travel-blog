import React from 'react';

const STATS = [
  { number: '120+', label: 'Destinations' },
  { number: '500K', label: 'Readers' },
  { number: '4.9', label: 'Rating' },
  { number: '200+', label: 'Blogs' }
];

export default function StatsBar() {
  const tickerItems = [...STATS, ...STATS];

  return (
    <section className="stats-ticker" aria-label="Travel platform highlights">
      <div className="stats-ticker-viewport">
        <div className="stats-ticker-track">
          {tickerItems.map((item, idx) => (
            <article key={`${item.label}-${idx}`} className="stats-ticker-item">
              <span className="stats-ticker-number">{item.number}</span>
              <span className="stats-ticker-label">{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
