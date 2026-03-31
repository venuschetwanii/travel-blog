import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE } from '../api';
import useDebounce from '../hooks/useDebounce';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search destinations, budgets, tips...',
  interactive = false,
  onResultSelect
}) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    if (!interactive) return;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onEsc);
    };
  }, [interactive]);

  useEffect(() => {
    if (!interactive) return;
    if (!debounced.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    api
      .get('/api/blogs', { params: { search: debounced, limit: 5 } })
      .then((res) => {
        setResults(res.data.data || []);
        setOpen(true);
      })
      .finally(() => setLoading(false));
  }, [debounced, interactive]);

  const selectResult = (item) => {
    setOpen(false);
    onResultSelect?.(item);
    navigate(`/blog/${item.slug}`);
  };

  const handleSearchClick = () => {
    if (!interactive) return;
    if (results[0]) {
      selectResult(results[0]);
      return;
    }
    setOpen(Boolean(debounced.trim()));
  };

  return (
    <div className={`search-wrap ${interactive ? 'interactive' : ''}`} ref={wrapRef}>
      <div className="search-shell">
        <span className="icon">🔍</span>
        <input
          className="search"
          value={value}
          onFocus={() => interactive && debounced && setOpen(true)}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) {
              e.preventDefault();
              selectResult(results[0]);
            }
          }}
          placeholder={placeholder}
        />
        <button type="button" onClick={handleSearchClick}>
          Search →
        </button>
      </div>

      <AnimatePresence>
        {interactive && open && (
          <motion.div
            className="search-dropdown"
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            style={{ transformOrigin: 'top' }}
            transition={{ duration: 0.2 }}
          >
            {loading ? <p className="search-empty">Searching...</p> : null}
            {!loading && results.length === 0 ? (
              <p className="search-empty">No adventures found for "{debounced}"...</p>
            ) : null}
            {!loading &&
              results.map((item) => {
                const cover = (Array.isArray(item.images) && item.images[0]) || item.image;
                return (
                  <button key={item.id} type="button" className="search-result" onClick={() => selectResult(item)}>
                    {cover ? <img src={`${API_BASE}${cover}`} alt={item.title} /> : <span className="dot" />}
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.category}</small>
                    </div>
                  </button>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
