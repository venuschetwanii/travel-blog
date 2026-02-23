const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../utils/db');

const router = express.Router();
const COMMENTS_FILE = 'comments.json';

router.get('/', (req, res) => {
  const approvedOnly = req.query.approved === 'true';
  const comments = readJson(COMMENTS_FILE)
    .filter((c) => (approvedOnly ? c.approved : true))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(comments);
});

router.get('/:blogId', (req, res) => {
  const comments = readJson(COMMENTS_FILE)
    .filter((c) => c.blogId === req.params.blogId && c.approved)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(comments);
});

router.post('/', (req, res) => {
  const comments = readJson(COMMENTS_FILE);
  const { blogId, name, email, comment } = req.body;
  if (!blogId || !name || !email || !comment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newComment = {
    id: uuidv4(),
    blogId,
    name,
    email,
    comment,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    likes: 0,
    approved: true,
    createdAt: new Date().toISOString()
  };

  comments.push(newComment);
  writeJson(COMMENTS_FILE, comments);
  return res.status(201).json(newComment);
});

router.delete('/:id', (req, res) => {
  const comments = readJson(COMMENTS_FILE);
  const index = comments.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Comment not found' });

  const [removed] = comments.splice(index, 1);
  writeJson(COMMENTS_FILE, comments);
  return res.json({ message: 'Deleted', comment: removed });
});

router.patch('/:id/like', (req, res) => {
  const comments = readJson(COMMENTS_FILE);
  const index = comments.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Comment not found' });

  comments[index].likes = (comments[index].likes || 0) + 1;
  writeJson(COMMENTS_FILE, comments);
  return res.json(comments[index]);
});

module.exports = router;
