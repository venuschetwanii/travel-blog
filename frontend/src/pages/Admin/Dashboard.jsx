import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  RiArticleLine,
  RiChat3Line,
  RiEyeLine,
  RiRocket2Line,
  RiTimeLine
} from 'react-icons/ri';
import api from '../../api';
import AdminLayout from '../../components/Admin/AdminLayout';
import BlogTable from '../../components/Admin/BlogTable';
import StatCard from '../../components/Admin/StatCard';
import { showAdminToast } from '../../components/Admin/Toast';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const load = () => {
    Promise.all([api.get('/api/blogs/all'), api.get('/api/comments')]).then(([blogRes, commentRes]) => {
      setBlogs(blogRes.data || []);
      setComments(commentRes.data || []);
    });
  };

  useEffect(load, []);

  const stats = useMemo(() => ({
    total: blogs.length,
    published: blogs.filter((b) => b.published).length,
    drafts: blogs.filter((b) => !b.published).length,
    views: blogs.reduce((acc, b) => acc + (b.views || 0), 0),
    comments: comments.length
  }), [blogs, comments]);

  const togglePublish = async (id) => {
    await api.patch(`/api/blogs/${id}/toggle-publish`);
    showAdminToast('info', 'Publish state updated');
    load();
  };
  const removeBlog = async (id) => {
    await api.delete(`/api/blogs/${id}`);
    showAdminToast('success', 'Blog deleted');
    load();
  };
  return (
    <AdminLayout>
      <motion.section className="admin-panel" variants={containerVariants} initial="hidden" animate="show">
        <motion.div className="instruments" variants={itemVariants}>
          <StatCard label="Total Blogs" value={stats.total} icon={RiArticleLine} accent="#F59E0B" />
          <StatCard label="Published" value={stats.published} icon={RiRocket2Line} accent="#10B981" />
          <StatCard label="Drafts" value={stats.drafts} icon={RiTimeLine} accent="#FBBF24" />
          <StatCard label="Total Views" value={stats.views} icon={RiEyeLine} accent="#06B6D4" compact />
          <StatCard label="Comments" value={stats.comments} icon={RiChat3Line} accent="#8B5CF6" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <BlogTable
            blogs={blogs}
            onEdit={(id) => navigate(`/admin/edit/${id}`)}
            onPreview={(blog) => navigate('/admin/preview', { state: { blog } })}
            onToggle={togglePublish}
            onDelete={removeBlog}
            onCreate={() => navigate('/admin/create')}
          />
        </motion.div>
      </motion.section>
    </AdminLayout>
  );
}
