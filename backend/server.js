require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { readJson } = require('./utils/db');

const blogsRouter = require('./routes/blogs');
const commentsRouter = require('./routes/comments');
const faqsRouter = require('./routes/faqs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nSitemap: http://localhost:5000/sitemap.xml');
});

app.get('/sitemap.xml', (_req, res) => {
  const blogs = readJson('blogs.json').filter((b) => b.published);
  const entries = blogs
    .map((b) => `<url><loc>http://localhost:3000/blog/${b.slug}</loc><lastmod>${b.updatedAt || b.createdAt}</lastmod></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>http://localhost:3000/</loc></url>
  <url><loc>http://localhost:3000/faq</loc></url>
  ${entries}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

app.use('/api/blogs', blogsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/faqs', faqsRouter);

app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image file too large. Max size is 5MB per file.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: 'Unexpected upload field. Use "images".' });
  }
  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
