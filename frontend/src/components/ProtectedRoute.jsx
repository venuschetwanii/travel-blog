import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token === 'authenticated' ? children : <Navigate to="/admin/login" replace />;
}
