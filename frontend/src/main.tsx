import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthenticationProvider } from './context/AuthenticationContext';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthenticationProvider>
  </React.StrictMode>,
);

reportWebVitals();
