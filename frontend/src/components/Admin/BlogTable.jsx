import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RiEyeLine, RiPencilLine, RiRefreshLine, RiSearchLine, RiDeleteBinLine } from 'react-icons/ri';
import DeleteConfirm from './DeleteConfirm';

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

const catColor = {
  Asia: '#06B6D4',
  Europe: '#8B5CF6',
  Adventure: '#10B981',
  Beach: '#38BDF8',
  Mountains: '#A78BFA',
  City: '#F59E0B'
};

export default function BlogTable({ blogs, onEdit, onPreview, onToggle, onDelete, onCreate }) {
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((b) => `${b.title} ${b.category}`.toLowerCase().includes(q));
  }, [blogs, query]);

  return (
    <section className="mission-log">
      <header>
        <h3>Mission Log</h3>
        <div className="log-actions">
          <button type="button" className="new-btn" onClick={onCreate}>+ New Mission</button>
          <label className="search-mini">
            <RiSearchLine />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
          </label>
        </div>
      </header>
      <div className="log-grid">
        <div className="head">Img</div>
        <div className="head">Title</div>
        <div className="head">Category</div>
        <div className="head">Status</div>
        <div className="head">Views</div>
        <div className="head">Actions</div>

        {filtered.map((b, idx) => {
          const cover = (Array.isArray(b.images) && b.images[0]) || b.image;
          return (
            <motion.div
              key={b.id}
              className="log-row"
              variants={rowVariants}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.04, duration: 0.35 }}
            >
              <div className="col thumb">
                {cover ? <img src={`http://localhost:5000${cover}`} alt={b.title} /> : <div className="no-thumb" />}
              </div>
              <div className="col title" title={b.title}>{b.title}</div>
              <div className="col">
                <span className="cat-pill" style={{ background: `${catColor[b.category] || '#334155'}22`, color: catColor[b.category] || '#cbd5e1' }}>
                  {b.category}
                </span>
              </div>
              <div className="col">
                <span className={`status-dot ${b.published ? 'live' : 'draft'}`} />
              </div>
              <div className="col">{b.views || 0}</div>
              <div className="col actions">
                <button type="button" className="icon amber" onClick={() => onEdit(b.id)}><RiPencilLine /></button>
                <button type="button" className="icon cyan" onClick={() => onPreview(b)}><RiEyeLine /></button>
                <button type="button" className="icon green" onClick={() => onToggle(b.id)}><RiRefreshLine /></button>
                <div className="delete-wrap">
                  <button type="button" className="icon red" onClick={() => setConfirmId(confirmId === b.id ? '' : b.id)}><RiDeleteBinLine /></button>
                  <DeleteConfirm
                    open={confirmId === b.id}
                    onCancel={() => setConfirmId('')}
                    onConfirm={() => {
                      onDelete(b.id);
                      setConfirmId('');
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
