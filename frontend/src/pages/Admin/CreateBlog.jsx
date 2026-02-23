import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import AdminLayout from '../../components/Admin/AdminLayout';
import LivePreview from '../../components/Admin/LivePreview';
import { showAdminToast } from '../../components/Admin/Toast';
import 'react-quill/dist/quill.snow.css';

const categories = ['Asia', 'Europe', 'Adventure', 'Beach', 'Mountains', 'City'];

const initial = {
  title: '',
  slug: '',
  excerpt: '',
  category: 'Adventure',
  tags: [],
  content: '',
  featured: false,
  published: true,
  seo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    canonicalUrl: ''
  }
};

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

const toSlug = (v) => v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export default function CreateBlog({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(initial);
  const [tagInput, setTagInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [slugPreview, setSlugPreview] = useState('');
  const [seoOpen, setSeoOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitState, setSubmitState] = useState('idle');

  useEffect(() => {
    const timer = setTimeout(() => setSlugPreview(toSlug(form.title || form.slug || 'untitled-story')), 300);
    return () => clearTimeout(timer);
  }, [form.title, form.slug]);

  useEffect(() => {
    if (!editMode || !id) return;
    api.get('/api/blogs/all').then((res) => {
      const found = (res.data || []).find((b) => b.id === id);
      if (!found) return;
      setForm({
        ...found,
        seo: found.seo || initial.seo
      });
      setSlugPreview(found.slug || '');
    });
  }, [editMode, id]);

  const readTime = useMemo(() => {
    const words = (form.content || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  }, [form.content]);

  const onDrop = (accepted) => {
    if (!accepted.length) return;
    setImageFiles((prev) => [...prev, ...accepted].slice(0, 10));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024
  });

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (form.tags.length >= 8) {
      showAdminToast('warning', 'Max 8 tags allowed');
      return;
    }
    if (form.tags.includes(tag)) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const onTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  const submit = async (publishOverride) => {
    const payload = new FormData();
    const draft = { ...form, slug: slugPreview, published: publishOverride };
    Object.entries(draft).forEach(([k, v]) => {
      if (k === 'tags') payload.append('tags', (v || []).join(','));
      else if (k === 'seo') payload.append('seo', JSON.stringify(v));
      else payload.append(k, v);
    });

    imageFiles.forEach((file) => payload.append('images', file));
    if (editMode && imageFiles.length) payload.append('replaceImages', 'true');

    setSubmitState(publishOverride ? 'publishing' : 'drafting');
    try {
      if (editMode) await api.put(`/api/blogs/${id}`, payload);
      else await api.post('/api/blogs', payload);
      setSubmitState('success');
      showAdminToast('success', publishOverride
        ? (editMode ? 'Blog updated and published!' : 'Blog published successfully!')
        : (editMode ? 'Draft updated successfully!' : 'Draft saved successfully!'));
      setTimeout(() => navigate('/admin/dashboard'), 800);
    } catch (error) {
      setSubmitState('idle');
      const message = error?.response?.data?.message || 'Failed to save blog. Please try again.';
      showAdminToast('error', message);
    }
  };

  return (
    <AdminLayout>
      <section className="admin-panel">
        <div className="editor-layout">
          <section className="editor-column">
            <h2>{editMode ? 'Edit Mission' : 'Create Mission'}</h2>

            <label>
              Title
              <input
                className="admin-field"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug: toSlug(title),
                    seo: {
                      ...prev.seo,
                      metaTitle: prev.seo.metaTitle || `${title} | TravelBlog`,
                      ogTitle: prev.seo.ogTitle || title
                    }
                  }));
                }}
              />
            </label>
            <div className="slug-preview">Slug: /blog/{slugPreview || 'untitled-story'}</div>

            <label>
              Excerpt
              <textarea
                rows={3}
                className="admin-textarea"
                maxLength={160}
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({
                  ...prev,
                  excerpt: e.target.value,
                  seo: {
                    ...prev.seo,
                    metaDescription: prev.seo.metaDescription || e.target.value,
                    ogDescription: prev.seo.ogDescription || e.target.value
                  }
                }))}
              />
            </label>
            <p className={`counter ${form.excerpt.length > 140 ? 'warn' : ''}`}>{form.excerpt.length} / 160</p>

            <label>Category</label>
            <div className="pill-select">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={form.category === cat ? 'active' : ''}
                  onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                >
                  {cat}
                </button>
              ))}
            </div>

            <label>Tags</label>
            <div className="tag-input-wrap">
              {form.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))}>x</button>
                </span>
              ))}
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onTagKeyDown} placeholder="Type and press Enter/comma" />
            </div>

            <label>Hero Image</label>
            <div {...getRootProps()} className={`upload-zone ${isDragActive ? 'drag' : ''}`}>
              <input {...getInputProps()} />
              <p>Drop your hero image here or click to browse</p>
              <small>PNG, JPG, WEBP - Max 5MB each</small>
            </div>
            {!!imageFiles.length && (
              <div className="image-preview-grid">
                {imageFiles.map((file) => (
                  <article key={`${file.name}-${file.size}`}>
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                    <p className="upload-meta">{file.name} · {(file.size / 1024 / 1024).toFixed(1)}MB</p>
                    <button type="button" onClick={() => setImageFiles((prev) => prev.filter((f) => f !== file))}>Remove</button>
                  </article>
                ))}
              </div>
            )}

            <label>Content</label>
            <ReactQuill modules={quillModules} value={form.content} onChange={(content) => setForm((prev) => ({ ...prev, content }))} />

            <section className="seo-accordion">
              <button type="button" className="seo-header" onClick={() => setSeoOpen((v) => !v)}>
                🔍 SEO Settings {seoOpen ? '▾' : '▸'}
              </button>
              <AnimatePresence initial={false}>
                {seoOpen && (
                  <motion.div className="seo-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <input className="admin-field" placeholder="Meta Title" value={form.seo.metaTitle} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))} />
                    <input className="admin-field" placeholder="Meta Description" maxLength={155} value={form.seo.metaDescription} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))} />
                    <p className="counter">{form.seo.metaDescription.length} / 155</p>
                    <input className="admin-field" placeholder="Keywords" value={form.seo.metaKeywords} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, metaKeywords: e.target.value } }))} />
                    <input className="admin-field" placeholder="OG Title" value={form.seo.ogTitle} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, ogTitle: e.target.value } }))} />
                    <input className="admin-field" placeholder="OG Description" value={form.seo.ogDescription} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, ogDescription: e.target.value } }))} />
                    <input className="admin-field" placeholder="Canonical URL" value={form.seo.canonicalUrl} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, canonicalUrl: e.target.value } }))} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <div className="sticky-action-bar">
              <div className="buttons">
                <button type="button" className="ghost-btn" onClick={() => setPreviewOpen(true)}>👁 Preview</button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => submit(false)}
                  disabled={submitState === 'publishing' || submitState === 'drafting'}
                >
                  {submitState === 'drafting' ? 'Saving draft...' : '📁 Save Draft'}
                </button>
                <button type="button" className="primary-btn" onClick={() => submit(true)}>
                  {submitState === 'publishing' ? 'Publishing...' : submitState === 'success' ? '✓ Done' : '🚀 Publish'}
                </button>
              </div>
            </div>
          </section>

          <LivePreview form={form} imageFiles={imageFiles} readTime={readTime} />
        </div>
      </section>

      <AnimatePresence>
        {previewOpen && (
          <motion.div className="preview-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="preview-modal-inner" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }}>
              <LivePreview form={form} imageFiles={imageFiles} readTime={readTime} />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="ghost-btn" onClick={() => setPreviewOpen(false)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
