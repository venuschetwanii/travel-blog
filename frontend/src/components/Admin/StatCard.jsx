import React, { useEffect, useState } from 'react';

function formatValue(value, compact) {
  const n = Number(value) || 0;
  if (!compact) return String(n);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function StatCard({ label, value, icon: Icon, accent = '#F59E0B', compact = false }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.floor(target * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <article className="instrument-card" style={{ '--accent': accent }}>
      <div className="line" />
      <div className="instrument-head">
        <p>{label}</p>
        {Icon ? <Icon className="instrument-icon" size={28} /> : null}
      </div>
      <h3>{formatValue(display, compact)}</h3>
      <div className="sparkline" aria-hidden>
        {[10, 15, 9, 20, 14, 24, 16, 22].map((h, idx) => (
          <span key={idx} style={{ height: `${h}px` }} />
        ))}
      </div>
    </article>
  );
}
