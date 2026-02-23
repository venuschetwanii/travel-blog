import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiDeleteBinLine, RiRefreshLine } from 'react-icons/ri';
import api from '../../api';
import AdminLayout from '../../components/Admin/AdminLayout';
import { showAdminToast } from '../../components/Admin/Toast';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/comments');
      setComments(res.data || []);
    } catch (_err) {
      showAdminToast('error', 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const removeComment = async (id) => {
    try {
      await api.delete(`/api/comments/${id}`);
      setComments((prev) => prev.filter((item) => item.id !== id));
      showAdminToast('success', 'Comment removed');
    } catch (_err) {
      showAdminToast('error', 'Failed to remove comment');
    }
  };

  return (
    <AdminLayout>
      <motion.section
        className="admin-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <section className="signal-feed">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Comments ({comments.length})</h3>
            <button type="button" className="new-btn" onClick={loadComments}>
              <RiRefreshLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Refresh
            </button>
          </header>

          {loading ? <p>Loading comments...</p> : null}
          {!loading && comments.length === 0 ? <p>No comments found.</p> : null}

          {!loading && comments.map((c) => (
            <article className="comment-feed-item" key={c.id}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name || 'Guest')}`} alt={c.name || 'Guest'} />
              <div>
                <strong>{c.name || 'Guest'}</strong>
                <p>{c.comment}</p>
              </div>
              <small>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</small>
              <button type="button" className="icon red" onClick={() => removeComment(c.id)} aria-label="Delete comment">
                <RiDeleteBinLine />
              </button>
            </article>
          ))}
        </section>
      </motion.section>
    </AdminLayout>
  );
}
