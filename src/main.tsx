import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import '@fontsource/pretendard';
import '@/index.css';
import App, { GlobalStyle } from '@/App.tsx';
import CoursePage from '@/pages/CoursePage';
import theme from '@/theme/theme';

const withTheme = (node: React.ReactElement) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    {node}
  </ThemeProvider>
);

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/course', element: withTheme(<CoursePage />) },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>,
);
