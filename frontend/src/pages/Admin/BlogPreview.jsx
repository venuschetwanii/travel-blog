import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BlogPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateBlog = location.state?.blog;
  const sessionBlog = JSON.parse(sessionStorage.getItem('previewBlog') || 'null');
  const blog = stateBlog || sessionBlog;
  const cover = (Array.isArray(blog?.images) && blog.images[0]) || blog?.image;
  const coverSrc = !cover
    ? ''
    : cover.startsWith('blob:') || cover.startsWith('http')
      ? cover
      : `http://localhost:5000${cover}`;

  if (!blog) return <main className="container"><p>No preview data found.</p></main>;

  return (
    <main>
      <div className="preview-banner">This is a Preview - Not yet published</div>
      <section className="detail-hero">
        {coverSrc ? <img src={coverSrc} alt={blog.title} /> : <div className="image-fallback" />}
        <div className="detail-overlay"><h1>{blog.title}</h1><p>{blog.author || 'Admin'} | {blog.readTime || '1 min read'}</p></div>
      </section>
      <section className="container blog-content" dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content.</p>' }} />
      <section className="container"><button onClick={() => navigate(-1)}>Back</button></section>
    </main>
  );
}
