import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminLayout from '../../components/Admin/AdminLayout';
import { showAdminToast } from '../../components/Admin/Toast';

export default function Faqs() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/api/faqs')
      .then((res) => setFaqs(res.data || []))
      .catch(() => showAdminToast('error', 'Failed to load FAQs'));
  }, []);

  const filtered = useMemo(
    () => faqs.filter((f) => [f.question, f.answer, f.category].join(' ').toLowerCase().includes(query.toLowerCase())),
    [faqs, query]
  );

  return (
    <AdminLayout>
      <motion.section
        className="admin-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <section className="mission-log">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>FAQ Library ({filtered.length})</h3>
            <button type="button" className="new-btn" onClick={() => navigate('/faq')}>
              Open Public FAQ
            </button>
          </header>

          <input
            className="admin-field"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQ by keyword..."
          />

          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {filtered.map((faq) => (
              <article key={faq.id} className="comment-feed-item" style={{ gridTemplateColumns: '1fr' }}>
                <strong>{faq.question}</strong>
                <p style={{ marginTop: 6 }}>{faq.answer}</p>
                <small>{faq.category || 'General'}</small>
              </article>
            ))}
            {!filtered.length ? <p>No FAQ entries found.</p> : null}
          </div>
        </section>
      </motion.section>
    </AdminLayout>
  );
}
