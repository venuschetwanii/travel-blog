import React, { useMemo, useState } from 'react';

const baseByCategory = {
  Asia: 32,
  Europe: 48,
  Adventure: 40,
  Beach: 36,
  Mountains: 34,
  City: 44
};

export default function BudgetRealitySlider({ category = 'Adventure' }) {
  const [level, setLevel] = useState(35);
  const base = baseByCategory[category] || 38;

  const calc = useMemo(() => {
    const multiplier = 0.72 + level / 100;
    const day = Math.round(base * multiplier);
    return {
      day,
      stay: Math.round(day * 0.4),
      food: Math.round(day * 0.3),
      move: Math.round(day * 0.2),
      extras: Math.round(day * 0.1)
    };
  }, [base, level]);

  return (
    <section className="budget-reality">
      <div className="head">
        <h3>Budget Reality Slider</h3>
        <p>Adjust comfort level and see real daily spend.</p>
      </div>
      <label htmlFor="budget-range">Comfort Level: {level}%</label>
      <input id="budget-range" type="range" min="0" max="100" value={level} onChange={(e) => setLevel(Number(e.target.value))} />
      <div className="daily">${calc.day}<span>/day</span></div>
      <div className="breakdown">
        <article><small>Stay</small><p>${calc.stay}</p></article>
        <article><small>Food</small><p>${calc.food}</p></article>
        <article><small>Transport</small><p>${calc.move}</p></article>
        <article><small>Extras</small><p>${calc.extras}</p></article>
      </div>
    </section>
  );
}
