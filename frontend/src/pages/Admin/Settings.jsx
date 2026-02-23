import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/Admin/AdminLayout';
import { showAdminToast } from '../../components/Admin/Toast';

const SETTINGS_KEY = 'admin-settings-v1';

export default function Settings() {
  const [settings, setSettings] = useState({
    compactDashboard: false,
    notifications: true,
    defaultEditorMode: 'rich'
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch (_err) {
      // Ignore malformed saved settings.
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    showAdminToast('success', 'Settings saved');
  };

  return (
    <AdminLayout>
      <motion.section
        className="admin-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <section className="mission-log">
          <h3 style={{ marginTop: 0 }}>Admin Settings</h3>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={settings.compactDashboard}
              onChange={(e) => setSettings((prev) => ({ ...prev, compactDashboard: e.target.checked }))}
            />
            <span>Use compact dashboard cards</span>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings((prev) => ({ ...prev, notifications: e.target.checked }))}
            />
            <span>Enable admin notifications</span>
          </label>

          <label style={{ display: 'grid', gap: 6, marginTop: 10 }}>
            <span>Default editor mode</span>
            <select
              className="admin-field"
              value={settings.defaultEditorMode}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultEditorMode: e.target.value }))}
            >
              <option value="rich">Rich text</option>
              <option value="markdown">Markdown</option>
            </select>
          </label>

          <button type="button" className="new-btn" style={{ marginTop: 14 }} onClick={saveSettings}>
            Save Settings
          </button>
        </section>
      </motion.section>
    </AdminLayout>
  );
}
