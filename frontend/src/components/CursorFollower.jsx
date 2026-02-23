import React, { useEffect, useRef, useState } from 'react';

export default function CursorFollower() {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) return undefined;
    const move = (e) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    const over = (e) => {
      const el = e.target.closest('a, button, .blog-card, img');
      setActive(!!el);
      if (!el) return setLabel('');
      if (el.matches('img')) setLabel('View');
      else if (el.matches('.blog-card')) setLabel('Read →');
      else setLabel('');
    };
    let raf = 0;
    const tick = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.18;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.18;
      if (ref.current) ref.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`cursor-follower ${active ? 'active' : ''}`}>
      <span>{label}</span>
    </div>
  );
}
