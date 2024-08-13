import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const applyTheme = (theme) => {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
};

const ThemeProvider = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <App theme={theme} setTheme={setTheme} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider />
  </React.StrictMode>
);

reportWebVitals();
