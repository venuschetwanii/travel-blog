import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiChat3Line,
  RiDashboardLine,
  RiFileList3Line,
  RiLogoutBoxRLine,
  RiQuestionLine,
  RiQuillPenLine,
  RiSettings3Line
} from 'react-icons/ri';

const iconByKey = {
  dashboard: RiDashboardLine,
  create: RiQuillPenLine,
  blogs: RiFileList3Line,
  comments: RiChat3Line,
  faqs: RiQuestionLine,
  settings: RiSettings3Line
};

export default function Sidebar({ items = [], currentPath, onLogout }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const activeKey = useMemo(() => {
    if (currentPath.includes('/settings')) return 'settings';
    if (currentPath.includes('/faqs')) return 'faqs';
    if (currentPath.includes('/comments')) return 'comments';
    if (currentPath.includes('/blogs')) return 'blogs';
    if (currentPath.includes('/create')) return 'create';
    if (currentPath.includes('/dashboard')) return 'dashboard';
    return '';
  }, [currentPath]);

  return (
    <aside
      className={`admin-rail ${expanded ? 'is-expanded' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="rail-items">
        {items.map((item) => {
          const Icon = iconByKey[item.key] || RiDashboardLine;
          const active = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              className={`rail-btn ${active ? 'active' : ''}`}
              title={item.label}
              onClick={() => navigate(item.to)}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="rail-btn rail-logout" onClick={onLogout} title="Logout">
        <RiLogoutBoxRLine size={22} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
