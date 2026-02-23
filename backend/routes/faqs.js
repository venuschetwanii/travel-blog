const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../utils/db');

const router = express.Router();
const FAQS_FILE = 'faqs.json';

router.get('/', (_req, res) => {
  const faqs = readJson(FAQS_FILE).sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  res.json(faqs);
});

router.get('/:id', (req, res) => {
  const faq = readJson(FAQS_FILE).find((f) => f.id === req.params.id);
  if (!faq) return res.status(404).json({ message: 'FAQ not found' });
  return res.json(faq);
});

router.post('/', (req, res) => {
  const { question, answer, category = 'General', order = 1 } = req.body;
  if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required' });

  const faqs = readJson(FAQS_FILE);
  const newFaq = { id: uuidv4(), question, answer, category, order: Number(order) || 1 };
  faqs.push(newFaq);
  writeJson(FAQS_FILE, faqs);
  return res.status(201).json(newFaq);
});

router.put('/:id', (req, res) => {
  const faqs = readJson(FAQS_FILE);
  const index = faqs.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'FAQ not found' });

  faqs[index] = { ...faqs[index], ...req.body, id: faqs[index].id };
  writeJson(FAQS_FILE, faqs);
  return res.json(faqs[index]);
});

router.delete('/:id', (req, res) => {
  const faqs = readJson(FAQS_FILE);
  const index = faqs.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'FAQ not found' });

  const [deleted] = faqs.splice(index, 1);
  writeJson(FAQS_FILE, faqs);
  return res.json({ message: 'Deleted', faq: deleted });
});

module.exports = router;
