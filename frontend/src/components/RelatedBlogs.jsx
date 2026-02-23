import React from 'react';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

export default function RelatedBlogs({ blogs = [] }) {
  return (
    <section className="container related-wrap">
      <h2>More Dispatches →</h2>
      <motion.div
        className="blog-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        {blogs.map((b) => (
          <motion.div key={b.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <BlogCard blog={b} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
