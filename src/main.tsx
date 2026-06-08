import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
