import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function fmtViews(v = 0) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return String(v);
}

export default function BlogCard({ blog, hero = false }) {
  const cover = (Array.isArray(blog.images) && blog.images[0]) || blog.image;
  const tags = (blog.tags || []).slice(0, 2);

  return (
    <Link to={`/blog/${blog.slug}`} className={`blog-card ${hero ? 'hero' : 'standard'}`}>
      <div className="card-media">
        {cover ? <img className="card-image" src={`http://localhost:5000${cover}`} alt={blog.title} /> : <div className="card-image image-fallback" />}
        <span className="category-badge">{blog.category}</span>
      </div>
      <div className="card-body">
        <div className="tag-row">{tags.map((t) => <span key={t}>#{t}</span>)}</div>
        <h3>{blog.title}</h3>
        <p>{blog.excerpt}</p>
        <div className="card-meta">
          <div className="left">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(blog.author || 'Admin')}`} alt={blog.author} />
            <span>{blog.author || 'Admin'} · {format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="right">
            <span>⏱ {blog.readTime}</span>
            <span>👁 {fmtViews(blog.views || 0)}</span>
          </div>
        </div>
        {hero ? <span className="hero-cta">Read Story →</span> : null}
      </div>
    </Link>
  );
}
