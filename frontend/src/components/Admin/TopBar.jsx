import React, { useEffect, useMemo, useState } from 'react';

export default function TopBar({ breadcrumbs = [], onLogout, onOpenProfile }) {
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeText = useMemo(
    () => now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    [now]
  );

  return (
    <header className="admin-topbar">
      <button className="plane-logo" type="button" aria-label="PlanePenny">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path d="M3 12.5L21 3L14.5 21L11 13.8L3 12.5Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <span>BudgetFriendly</span>
      </button>

      <div className="crumbs">
        {breadcrumbs.map((item, i) => (
          <span key={item + i}>
            {item}
            {i < breadcrumbs.length - 1 ? ' > ' : ''}
          </span>
        ))}
      </div>

      <div className="top-actions">
        <span className="clock">{timeText}</span>
        <div className="avatar-wrap">
          <button type="button" className="avatar-btn" onClick={() => setOpen((v) => !v)}>
            <span>A</span>
          </button>
          {open && (
            <div className="avatar-menu">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
              >
                Profile
              </button>
              <button type="button" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
