import React, { useMemo, useState } from 'react';

const tipsByCategory = {
  Asia: [
    'Book trains earlier instead of same-day premium buses.',
    'Stay one area longer to reduce transport waste.',
    'Use local eateries away from the main square.'
  ],
  Europe: [
    'Use city passes only if you plan 3+ attractions/day.',
    'Travel between cities at off-peak hours.',
    'Prioritize free walking tours early in the trip.'
  ],
  Adventure: [
    'Rent gear locally instead of carrying everything.',
    'Avoid private transfers unless split with group.',
    'Keep one buffer day for weather changes.'
  ]
};

export default function WhatIdDoDifferently({ category = 'Adventure' }) {
  const [open, setOpen] = useState(true);
  const points = useMemo(() => tipsByCategory[category] || tipsByCategory.Adventure, [category]);

  return (
    <section className="what-diff">
      <button type="button" className="toggle" onClick={() => setOpen((v) => !v)}>
        What I’d Do Differently {open ? '▾' : '▸'}
      </button>
      {open && (
        <ul>
          {points.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}
    </section>
  );
}
