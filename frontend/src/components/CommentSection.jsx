import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api';

export default function CommentSection({ blogId, comments, onAdded }) {
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [posting, setPosting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const sorted = useMemo(() => [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [comments]);
  const visible = sorted.slice(0, visibleCount);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.comment) return;
    setPosting(true);
    const res = await api.post('/api/comments', { blogId, ...form });
    onAdded(res.data);
    setForm({ name: '', email: '', comment: '' });
    setPosting(false);
  };

  const likeComment = async (id) => {
    onAdded({ id, optimisticLike: true });
    try { await api.patch(`/api/comments/${id}/like`); } catch {}
  };

  return (
    <section className="comments logbook">
      <h3 className="stamp-title">Leave Your Mark</h3>
      <form onSubmit={submit} className="comment-form editorial">
        <div className="two">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <textarea rows={4} placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <button type="submit">{posting ? 'Posting...' : 'Post Comment →'}</button>
      </form>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        <AnimatePresence>
          {visible.map((c) => (
            <motion.article key={c.id} className="comment-item log" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <img src={c.avatar} alt={c.name} />
              <div>
                <h4>{c.name}</h4>
                <small>{new Date(c.createdAt).toLocaleDateString()}</small>
                <p>{c.comment}</p>
              </div>
              <motion.button whileTap={{ scale: 1.2 }} onClick={() => likeComment(c.id)}>♥ {c.likes || 0}</motion.button>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleCount < sorted.length && (
        <button type="button" className="load-more" onClick={() => setVisibleCount((v) => v + 5)}>Load More</button>
      )}
    </section>
  );
}
