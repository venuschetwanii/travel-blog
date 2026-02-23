import React from 'react';

export default function LivePreview({ form, imageFiles = [], readTime = '1 min read' }) {
  const preview = imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : '';
  const firstTag = form.tags?.[0] || 'travel';
  const title = form.title || 'Untitled story';
  const excerpt = form.excerpt || 'Write your excerpt to preview this card.';
  const urlSlug = form.slug || 'untitled-story';

  return (
    <aside className="live-preview">
      <div className="browser-bar">● ● ● planepenny.com/blog/{urlSlug}</div>
      <div className="preview-card">
        {preview ? <img src={preview} alt={title} /> : <div className="preview-image-empty" />}
        <div className="preview-copy">
          <span className="cat">{form.category || 'Adventure'}</span>
          <h4>{title}</h4>
          <p>{excerpt}</p>
          <small>{readTime} · #{firstTag}</small>
        </div>
      </div>
      <div className="seo-preview">
        <h5>SEO Preview</h5>
        <strong>{form.seo?.metaTitle || title}</strong>
        <span>planepenny.com/blog/{urlSlug}</span>
        <p>{form.seo?.metaDescription || excerpt}</p>
      </div>
      <div className="og-preview">
        <h5>OG Card</h5>
        <div>
          <b>{form.seo?.ogTitle || title}</b>
          <p>{form.seo?.ogDescription || excerpt}</p>
        </div>
      </div>
    </aside>
  );
}
