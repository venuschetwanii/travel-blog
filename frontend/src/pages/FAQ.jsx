import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api';
import SearchBar from '../components/SearchBar';

const categories = ['All', 'General', 'Visa', 'Planning', 'Safety'];

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [openId, setOpenId] = useState(null);

  useEffect(() => { api.get('/api/faqs').then((res) => setFaqs(res.data || [])); }, []);
  const filtered = useMemo(() => faqs.filter((f) => (category === 'All' || f.category === category) && [f.question, f.answer].join(' ').toLowerCase().includes(search.toLowerCase())), [faqs, search, category]);

  return (
    <main>
      <section className="faq-hero"><h1>Travel FAQ</h1><p>All core answers for low-budget travel.</p></section>
      <section className="container">
        <SearchBar value={search} onChange={setSearch} placeholder="Search FAQs..." />
        <div className="tabs">{categories.map((c) => <button key={c} className={c===category?'active':''} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="faq-list">
          {filtered.map((f) => (
            <div className="faq-item" key={f.id}>
              <button onClick={() => setOpenId(openId === f.id ? null : f.id)}>{f.question}</button>
              <AnimatePresence>{openId === f.id && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}><p>{f.answer}</p></motion.div>}</AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
