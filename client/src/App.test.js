import { render, screen } from '@testing-library/react';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import AuthenticationContextProvider from './context/AuthenticationContextProvider';
import { GeneralContextProvider } from './context/GeneralContextProvider';

test('renders App component', () => {
  render(
    <BrowserRouter>
      <AuthenticationContextProvider>
        <GeneralContextProvider>
          <App />
        </GeneralContextProvider>
      </AuthenticationContextProvider>
    </BrowserRouter>
  );
});
