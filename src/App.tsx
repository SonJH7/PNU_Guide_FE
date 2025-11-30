import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import HomePage from '@/pages/HomePage';
import theme from '@/theme/theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: ${theme.palette.background.default};
    color: ${theme.palette.text.primary};
    font-family: ${theme.typography.fontFamily};
  }
`;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <HomePage />
    </ThemeProvider>
  );
};

export default App;
