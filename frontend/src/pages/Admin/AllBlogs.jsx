import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminLayout from '../../components/Admin/AdminLayout';
import BlogTable from '../../components/Admin/BlogTable';
import { showAdminToast } from '../../components/Admin/Toast';

export default function AllBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/blogs/all');
      setBlogs(res.data || []);
    } catch (_err) {
      showAdminToast('error', 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const togglePublish = async (id) => {
    await api.patch(`/api/blogs/${id}/toggle-publish`);
    showAdminToast('info', 'Publish state updated');
    loadBlogs();
  };

  const removeBlog = async (id) => {
    await api.delete(`/api/blogs/${id}`);
    showAdminToast('success', 'Blog deleted');
    loadBlogs();
  };

  return (
    <AdminLayout>
      <motion.section
        className="admin-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {loading ? (
          <section className="mission-log">
            <h3 style={{ margin: 0 }}>All Blogs</h3>
            <p style={{ marginTop: 10 }}>Loading blogs...</p>
          </section>
        ) : (
          <BlogTable
            blogs={blogs}
            onEdit={(id) => navigate(`/admin/edit/${id}`)}
            onPreview={(blog) => navigate('/admin/preview', { state: { blog } })}
            onToggle={togglePublish}
            onDelete={removeBlog}
            onCreate={() => navigate('/admin/create')}
          />
        )}
      </motion.section>
    </AdminLayout>
  );
}
