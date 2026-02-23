import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import FAQ from './pages/FAQ';
import AdminLogin from './pages/Admin/AdminLogin';
import Dashboard from './pages/Admin/Dashboard';
import AllBlogs from './pages/Admin/AllBlogs';
import CreateBlog from './pages/Admin/CreateBlog';
import EditBlog from './pages/Admin/EditBlog';
import BlogPreview from './pages/Admin/BlogPreview';
import Comments from './pages/Admin/Comments';
import Faqs from './pages/Admin/Faqs';
import Settings from './pages/Admin/Settings';
import NotFound from './pages/NotFound';
import CursorFollower from './components/CursorFollower';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    document.body.classList.toggle('admin-mode', isAdminRoute);
    return () => document.body.classList.remove('admin-mode');
  }, [isAdminRoute]);

  React.useEffect(() => {
    if (isAdminRoute) return undefined;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    let raf = 0;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [isAdminRoute]);

  const page = (element) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {element}
    </motion.div>
  );

  return (
    <div className="app-shell">
      <ScrollToTop />
      {!isAdminRoute && <CursorFollower />}
      {!isAdminRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={page(<Home />)} />
          <Route path="/blog/:slug" element={page(<BlogDetail />)} />
          <Route path="/faq" element={page(<FAQ />)} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute><AllBlogs /></ProtectedRoute>} />
          <Route path="/admin/comments" element={<ProtectedRoute><Comments /></ProtectedRoute>} />
          <Route path="/admin/faqs" element={<ProtectedRoute><Faqs /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
          <Route path="/admin/preview" element={<ProtectedRoute><BlogPreview /></ProtectedRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={page(<NotFound />)} />
        </Routes>
      </AnimatePresence>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
