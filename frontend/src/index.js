import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import AdminToast from './components/Admin/Toast';
import './styles/global.css';
import './styles.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <AdminToast />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
