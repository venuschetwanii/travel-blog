import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="lost">??</div>
      <h1>404 - Lost Traveler</h1>
      <p>This route does not exist. Head back to base camp.</p>
      <Link to="/">Go Home</Link>
    </main>
  );
}
