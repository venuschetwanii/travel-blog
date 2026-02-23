import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import CommentSection from '../components/CommentSection';
import RelatedBlogs from '../components/RelatedBlogs';
import BudgetRealitySlider from '../components/BudgetRealitySlider';
import WhatIdDoDifferently from '../components/WhatIdDoDifferently';

function withHeadingIds(html = '') {
  let i = 0;
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (_m, level, attrs, text) => {
    const id = `h-${i++}`;
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
}

function extractHeadings(html = '') {
  const matches = [...html.matchAll(/<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi)];
  return matches.map((m) => ({ id: m[2], text: m[3].replace(/<[^>]*>/g, ''), level: Number(m[1]) }));
}

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, p)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let active = true;
    api.get(`/api/blogs/${slug}`).then(async (res) => {
      if (!active) return;
      setBlog(res.data);
      const [commentRes, allRes] = await Promise.all([
        api.get(`/api/comments/${res.data.id}`),
        api.get('/api/blogs', { params: { category: res.data.category, limit: 12 } })
      ]);
      if (!active) return;
      setComments(commentRes.data || []);
      setRelated((allRes.data.data || []).filter((b) => b.slug !== slug).slice(0, 3));
    }).catch(() => navigate('/404'));
    return () => { active = false; };
  }, [slug, navigate]);

  const contentHtml = useMemo(() => withHeadingIds(blog?.content || ''), [blog]);
  const headings = useMemo(() => extractHeadings(contentHtml), [contentHtml]);
  const cover = (Array.isArray(blog?.images) && blog?.images[0]) || blog?.image;

  const onAdded = (item) => {
    if (item.optimisticLike) return setComments((prev) => prev.map((c) => c.id === item.id ? { ...c, likes: (c.likes || 0) + 1 } : c));
    setComments((prev) => [item, ...prev]);
  };

  if (!blog) return null;

  return (
    <main className="blog-detail-page">
      <Helmet>
        <title>{blog.seo?.metaTitle || blog.title}</title>
      </Helmet>

      <div className="read-progress" style={{ width: `${progress}%` }} />

      <section className="detail-hero editorial">
        {cover ? <img src={`http://localhost:5000${cover}`} alt={blog.title} /> : <div className="image-fallback" />}
      </section>

      <section className="container detail-header-card">
        <div className="tags">
          <span className="category-badge">{blog.category}</span>
          {(blog.tags || []).slice(0, 3).map((t) => <span key={t}>#{t}</span>)}
        </div>
        <h1>{blog.title}</h1>
        <p className="meta">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(blog.author || 'Admin')}`} alt={blog.author} />
          By {blog.author} · {new Date(blog.createdAt).toLocaleDateString()} · {blog.readTime} · {blog.views} views
        </p>
      </section>

      <section className="container detail-layout">
        <article>
          <BudgetRealitySlider category={blog.category} />
          <div className="article-body" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          <WhatIdDoDifferently category={blog.category} />
        </article>

        <aside className="article-side">
          <div className="toc">
            <h4>Contents</h4>
            {headings.map((h) => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}
          </div>
          <div className="share">
            <button type="button" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`)}>𝕏</button>
            <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`)}>WA</button>
            <button type="button" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}>f</button>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
            >
              {copied ? '✓' : '⧉'}
            </button>
          </div>
        </aside>
      </section>

      <RelatedBlogs blogs={related} />
      <section className="container"><CommentSection blogId={blog.id} comments={comments} onAdded={onAdded} /></section>
    </main>
  );
}
