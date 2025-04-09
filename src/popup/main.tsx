import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.less';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer autoClose={2000} position="top-center" />
  </StrictMode>
);
