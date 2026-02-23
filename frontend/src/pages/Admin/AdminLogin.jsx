import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'travel2024') {
      localStorage.setItem('adminToken', 'authenticated');
      toast.success('Login successful');
      navigate('/admin/dashboard');
      return;
    }
    toast.error('Invalid credentials');
  };

  return (
    <main className="auth-wrap">
      <form onSubmit={login} className="card">
        <h2>Admin Login</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
