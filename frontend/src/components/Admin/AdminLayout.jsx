import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = useMemo(() => {
    const map = {
      '/admin/dashboard': ['Mission Control', 'Dashboard'],
      '/admin/blogs': ['Mission Control', 'Blog Manager', 'All Blogs'],
      '/admin/comments': ['Mission Control', 'Community', 'Comments'],
      '/admin/faqs': ['Mission Control', 'Help Center', 'FAQs'],
      '/admin/settings': ['Mission Control', 'System', 'Settings'],
      '/admin/create': ['Mission Control', 'Blog Manager', 'Create'],
      '/admin/edit': ['Mission Control', 'Blog Manager', 'Edit'],
      '/admin/preview': ['Mission Control', 'Preview']
    };
    if (location.pathname.startsWith('/admin/edit')) return map['/admin/edit'];
    return map[location.pathname] || ['Mission Control'];
  }, [location.pathname]);

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
    { key: 'create', label: 'Create Blog', to: '/admin/create' },
    { key: 'blogs', label: 'All Blogs', to: '/admin/blogs' },
    { key: 'comments', label: 'Comments', to: '/admin/comments' },
    { key: 'faqs', label: 'FAQs', to: '/admin/faqs' },
    { key: 'settings', label: 'Settings', to: '/admin/settings' }
  ];

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <TopBar
        breadcrumbs={breadcrumbs}
        onLogout={logout}
        onOpenProfile={() => navigate('/admin/settings')}
      />
      <Sidebar items={navItems} currentPath={location.pathname} onLogout={logout} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
