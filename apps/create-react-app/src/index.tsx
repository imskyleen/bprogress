import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ProgressProvider } from '@bprogress/react';
import { ProgressRouter } from './ProgressRouter';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ProgressProvider>
      <ProgressRouter />
      <App />
    </ProgressProvider>
  </React.StrictMode>,
);
