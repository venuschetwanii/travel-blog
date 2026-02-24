import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api';

const CATEGORIES = ['All', 'Asia', 'Europe', 'Adventure', 'Beach', 'Mountains', 'City'];

const CATEGORY_COLORS = {
  Asia: { bg: 'rgba(26,107,74,0.12)', text: '#1A6B4A', border: 'rgba(26,107,74,0.25)' },
  Europe: { bg: 'rgba(232,135,26,0.12)', text: '#C4720F', border: 'rgba(232,135,26,0.25)' },
  Adventure: { bg: 'rgba(196,83,58,0.12)', text: '#C4533A', border: 'rgba(196,83,58,0.25)' },
  Beach: { bg: 'rgba(14,107,133,0.12)', text: '#0E6B85', border: 'rgba(14,107,133,0.25)' },
  Mountains: { bg: 'rgba(124,106,78,0.12)', text: '#7C6A4E', border: 'rgba(124,106,78,0.25)' },
  City: { bg: 'rgba(15,26,20,0.08)', text: '#2C1A0E', border: 'rgba(15,26,20,0.15)' }
};

export default function BlogListing() {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    axios.get(`${API_BASE}/api/blogs`)
      .then((res) => {
        const data = res.data?.blogs || res.data?.data || res.data || [];
        const list = Array.isArray(data) ? data : [];
        setBlogs(list);
        setFiltered(list);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'All') setFiltered(blogs);
    else setFiltered(blogs.filter((b) => b.category === activeTab));
  }, [activeTab, blogs]);

  const getCategoryCount = (cat) => (
    cat === 'All' ? blogs.length : blogs.filter((b) => b.category === cat).length
  );

  const heroCard = filtered[0] || null;
  const gridCards = filtered.slice(1);

  return (
    <section className="bl-section" ref={ref} id="all-blogs">
      <div className="bl-inner">
        <div className="bl-header">
          <div className="bl-header-left">
            <p className="bl-eyebrow">
              <span className="bl-eyebrow-line" />
              Fresh from the road
            </p>
            <h2 className="bl-headline">
              Latest <em>Dispatches</em>
            </h2>
          </div>
          <button className="bl-view-all" onClick={() => navigate('/#all-blogs')} type="button">
            View All <span>→</span>
          </button>
        </div>

        <div className="bl-tabs-wrap">
          <div className="bl-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`bl-tab ${activeTab === cat ? 'bl-tab--active' : ''}`}
                onClick={() => setActiveTab(cat)}
                type="button"
              >
                {cat}
                <span className="bl-tab-count">{getCategoryCount(cat)}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="bl-loading">
            {[...Array(3)].map((_, i) => <div key={i} className="bl-skeleton" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bl-empty">
            <span className="bl-empty-icon">🗺️</span>
            <p>No dispatches found for <strong>{activeTab}</strong> yet.</p>
            <button onClick={() => setActiveTab('All')} type="button">
              See all guides →
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="bl-grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroCard && (
                <motion.div
                  className="bl-card bl-card--hero"
                  onClick={() => navigate(`/blog/${heroCard.slug}`)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                >
                  <div className="bl-card-img-wrap">
                    <img
                      src={heroCard.image ? `${API_BASE}${heroCard.image}` : ((heroCard.images && heroCard.images[0]) ? `${API_BASE}${heroCard.images[0]}` : '')}
                      alt={heroCard.title}
                      className="bl-card-img"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <CategoryBadge cat={heroCard.category} />
                    <div className="bl-card-img-overlay" />
                  </div>
                  <div className="bl-card-body">
                    <TagRow tags={heroCard.tags} />
                    <h3 className="bl-card-title bl-card-title--lg">{heroCard.title}</h3>
                    <p className="bl-card-excerpt">{heroCard.excerpt}</p>
                    <CardMeta blog={heroCard} />
                    <span className="bl-card-cta">
                      Read Story <span className="cta-arr">→</span>
                    </span>
                  </div>
                </motion.div>
              )}

              {gridCards.length > 0 && (
                <div className="bl-grid-right">
                  {gridCards.map((blog, i) => (
                    <motion.div
                      key={blog.id || blog._id || i}
                      className="bl-card bl-card--sm"
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      whileHover={{ y: -3, x: 3 }}
                      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      style={{ transitionDelay: `${i * 0.08}s` }}
                    >
                      <div className="bl-card-sm-img-wrap">
                        <img
                          src={blog.image ? `${API_BASE}${blog.image}` : ((blog.images && blog.images[0]) ? `${API_BASE}${blog.images[0]}` : '')}
                          alt={blog.title}
                          className="bl-card-img"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <CategoryBadge cat={blog.category} small />
                      </div>
                      <div className="bl-card-sm-body">
                        <TagRow tags={blog.tags} small />
                        <h3 className="bl-card-title bl-card-title--sm">{blog.title}</h3>
                        <p className="bl-card-excerpt bl-card-excerpt--sm">{blog.excerpt}</p>
                        <CardMeta blog={blog} small />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

function CategoryBadge({ cat, small }) {
  if (!cat) return null;
  const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.City;
  return (
    <span
      className={`bl-badge ${small ? 'bl-badge--sm' : ''}`}
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`
      }}
    >
      {cat}
    </span>
  );
}

function TagRow({ tags, small }) {
  if (!tags?.length) return null;
  return (
    <div className={`bl-tags ${small ? 'bl-tags--sm' : ''}`}>
      {tags.slice(0, 3).map((tag) => (
        <span key={tag} className="bl-tag">#{tag}</span>
      ))}
    </div>
  );
}

function CardMeta({ blog, small }) {
  return (
    <div className={`bl-meta ${small ? 'bl-meta--sm' : ''}`}>
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(blog.author || 'Admin')}`}
        alt={blog.author || 'Admin'}
        className="bl-meta-avatar"
      />
      <span className="bl-meta-author">{blog.author || 'Admin'}</span>
      <span className="bl-meta-dot">·</span>
      <span className="bl-meta-read">⏱ {blog.readTime || '1 min read'}</span>
      <span className="bl-meta-dot">·</span>
      <span className="bl-meta-views">👁 {blog.views || 0}</span>
    </div>
  );
}
