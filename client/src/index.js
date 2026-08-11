import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { GeneralContextProvider } from './context/GeneralContextProvider';
import AuthenticationContextProvider from './context/AuthenticationContextProvider';
import { ThemeContextProvider } from './context/ThemeContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthenticationContextProvider>
          <GeneralContextProvider>
            <App />
          </GeneralContextProvider>
        </AuthenticationContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
