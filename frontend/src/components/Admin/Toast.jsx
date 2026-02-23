import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export function showAdminToast(type, message) {
  const palette = {
    success: { border: '#10B981', glow: 'rgba(16,185,129,.28)' },
    error: { border: '#EF4444', glow: 'rgba(239,68,68,.28)' },
    warning: { border: '#F59E0B', glow: 'rgba(245,158,11,.28)' },
    info: { border: '#06B6D4', glow: 'rgba(6,182,212,.28)' }
  };
  const tone = palette[type] || palette.info;
  toast(message, {
    style: {
      borderLeft: `4px solid ${tone.border}`,
      background: 'rgba(15,23,42,.92)',
      color: '#f1f5f9',
      boxShadow: `0 0 30px ${tone.glow}`,
      borderRadius: '10px'
    }
  });
}

export default function AdminToast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgba(15,23,42,.92)',
          color: '#f1f5f9',
          border: '1px solid rgba(255,255,255,.12)'
        }
      }}
    />
  );
}
