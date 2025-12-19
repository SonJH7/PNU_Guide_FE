import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import '@fontsource/pretendard';
import '@/index.css';
import App, { GlobalStyle } from '@/App.tsx';
import ChatPage from '@/pages/ChatPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import CoursePage from '@/pages/CoursePage';
import CourseSearchPage from '@/pages/CourseSearchPage';
import MapPage from '@/pages/MapPage';
import StampPage from '@/pages/StampPage';
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
  { path: '/chatbot', element: withTheme(<ChatPage />) },
  { path: '/course/search', element: withTheme(<CourseSearchPage />) },
  { path: '/course/:id', element: withTheme(<CourseDetailPage />) },
  { path: '/map', element: withTheme(<MapPage />) },
  { path: '/stamp', element: withTheme(<StampPage />) },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>,
);
