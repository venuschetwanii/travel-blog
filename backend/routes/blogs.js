const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/upload');
const { readJson, writeJson } = require('../utils/db');

const router = express.Router();
const BLOGS_FILE = 'blogs.json';

const categories = ['Asia', 'Europe', 'Adventure', 'Beach', 'Mountains', 'City'];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function uniqueSlug(title, blogs, currentId = null) {
  const base = slugify(title) || 'untitled-blog';
  let slug = base;
  let n = 2;
  while (blogs.some((b) => b.slug === slug && b.id !== currentId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

function calcReadTime(content = '') {
  const plain = content.replace(/<[^>]*>/g, ' ').trim();
  const words = plain ? plain.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function makeSeo(payload, slug, imagePath, nowIso) {
  return {
    metaTitle: payload?.metaTitle || `${payload.title || 'Travel Blog'} | TravelBlog`,
    metaDescription: payload?.metaDescription || payload.excerpt || '',
    metaKeywords: payload?.metaKeywords || (payload.tags || []).join(', '),
    ogTitle: payload?.ogTitle || payload.title || 'Travel Blog',
    ogDescription: payload?.ogDescription || payload.excerpt || '',
    ogImage: payload?.ogImage || imagePath || '',
    canonicalUrl: payload?.canonicalUrl || `http://localhost:3000/blog/${slug}`,
    structuredData: payload?.structuredData || {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: payload.title || 'Travel Blog',
      image: imagePath || '',
      author: { '@type': 'Person', name: payload.author || 'Admin' },
      datePublished: nowIso,
      dateModified: nowIso
    }
  };
}

function parseSeoInput(rawSeo) {
  if (!rawSeo) return {};
  if (typeof rawSeo === 'object') return rawSeo;
  try {
    return JSON.parse(rawSeo);
  } catch {
    return {};
  }
}

function parseBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return fallback;
}

function getImageList(blog) {
  if (Array.isArray(blog?.images) && blog.images.length) return blog.images.filter(Boolean);
  if (blog?.image) return [blog.image];
  return [];
}

function removeUploadedFiles(imagePaths) {
  imagePaths.filter(Boolean).forEach((imagePath) => {
    const realPath = path.join(__dirname, '..', imagePath.replace(/^\//, ''));
    if (fs.existsSync(realPath)) fs.unlinkSync(realPath);
  });
}

router.get('/', (req, res) => {
  const { search = '', category = '', tag = '', page = '1', limit = '9', published } = req.query;
  let blogs = readJson(BLOGS_FILE);
  if (published === 'true') blogs = blogs.filter((b) => b.published);
  else if (published === 'false') blogs = blogs.filter((b) => !b.published);
  else blogs = blogs.filter((b) => b.published);

  let filtered = blogs;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((b) =>
      [b.title, b.excerpt, b.category, ...(b.tags || [])].join(' ').toLowerCase().includes(q)
    );
  }
  if (category) filtered = filtered.filter((b) => b.category === category);
  if (tag) filtered = filtered.filter((b) => (b.tags || []).includes(tag));

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const p = Number(page) || 1;
  const l = Number(limit) || 9;
  const start = (p - 1) * l;

  res.json({
    data: filtered.slice(start, start + l),
    meta: { total: filtered.length, page: p, limit: l, hasMore: start + l < filtered.length }
  });
});

router.get('/all', (_req, res) => {
  const blogs = readJson(BLOGS_FILE).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(blogs);
});

router.get('/featured', (_req, res) => {
  const featured = readJson(BLOGS_FILE).filter((b) => b.published && b.featured).slice(0, 3);
  res.json(featured);
});

router.get('/:slug', (req, res) => {
  const blogs = readJson(BLOGS_FILE);
  const index = blogs.findIndex((b) => b.slug === req.params.slug && b.published);
  if (index === -1) return res.status(404).json({ message: 'Blog not found' });

  blogs[index].views = (blogs[index].views || 0) + 1;
  blogs[index].updatedAt = new Date().toISOString();
  writeJson(BLOGS_FILE, blogs);

  return res.json(blogs[index]);
});

router.post('/', upload.array('images', 10), (req, res) => {
  const blogs = readJson(BLOGS_FILE);
  const now = new Date().toISOString();

  const tags = req.body.tags
    ? Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const slug = uniqueSlug(req.body.slug || req.body.title || 'untitled', blogs);
  const images = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const image = images[0] || '';
  const seoPayload = parseSeoInput(req.body.seo);
  const blog = {
    id: uuidv4(),
    title: req.body.title,
    slug,
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    image,
    images,
    category: categories.includes(req.body.category) ? req.body.category : 'Adventure',
    tags,
    author: req.body.author || 'Admin',
    readTime: calcReadTime(req.body.content || ''),
    published: parseBoolean(req.body.published, true),
    featured: parseBoolean(req.body.featured, false),
    views: 0,
    createdAt: now,
    updatedAt: now,
    seo: makeSeo({ ...seoPayload, title: req.body.title, excerpt: req.body.excerpt, tags }, slug, image, now)
  };

  blogs.push(blog);
  writeJson(BLOGS_FILE, blogs);
  res.status(201).json(blog);
});

router.put('/:id', upload.array('images', 10), (req, res) => {
  const blogs = readJson(BLOGS_FILE);
  const index = blogs.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Blog not found' });

  const existing = blogs[index];
  const tags = req.body.tags
    ? Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : existing.tags || [];

  const existingImages = getImageList(existing);
  const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const replaceImages = parseBoolean(req.body.replaceImages, false);
  if (replaceImages && existingImages.length) removeUploadedFiles(existingImages);
  const images = replaceImages ? uploadedImages : [...existingImages, ...uploadedImages];
  const image = images[0] || '';

  const slug = uniqueSlug(req.body.slug || req.body.title || existing.title, blogs, existing.id);
  const now = new Date().toISOString();
  const incomingSeo = parseSeoInput(req.body.seo) || existing.seo || {};

  blogs[index] = {
    ...existing,
    ...req.body,
    title: req.body.title || existing.title,
    slug,
    excerpt: req.body.excerpt || existing.excerpt,
    content: req.body.content || existing.content,
    image,
    images,
    tags,
    readTime: calcReadTime(req.body.content || existing.content || ''),
    published: req.body.published !== undefined ? parseBoolean(req.body.published) : existing.published,
    featured: req.body.featured !== undefined ? parseBoolean(req.body.featured) : existing.featured,
    updatedAt: now,
    seo: makeSeo(
      { ...incomingSeo, title: req.body.title || existing.title, excerpt: req.body.excerpt || existing.excerpt, tags },
      slug,
      image,
      existing.createdAt || now
    )
  };

  writeJson(BLOGS_FILE, blogs);
  return res.json(blogs[index]);
});

router.delete('/:id', (req, res) => {
  const blogs = readJson(BLOGS_FILE);
  const index = blogs.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Blog not found' });

  removeUploadedFiles(getImageList(blogs[index]));
  const [removed] = blogs.splice(index, 1);
  writeJson(BLOGS_FILE, blogs);

  return res.json({ message: 'Deleted', blog: removed });
});

router.patch('/:id/toggle-publish', (req, res) => {
  const blogs = readJson(BLOGS_FILE);
  const index = blogs.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Blog not found' });

  blogs[index].published = !blogs[index].published;
  blogs[index].updatedAt = new Date().toISOString();
  writeJson(BLOGS_FILE, blogs);

  return res.json(blogs[index]);
});

router.patch('/:id/toggle-featured', (req, res) => {
  const blogs = readJson(BLOGS_FILE);
  const index = blogs.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Blog not found' });

  blogs[index].featured = !blogs[index].featured;
  blogs[index].updatedAt = new Date().toISOString();
  writeJson(BLOGS_FILE, blogs);

  return res.json(blogs[index]);
});

module.exports = router;
