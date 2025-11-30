import { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

const baseSpacing = 4;

const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

const theme: DefaultTheme = {
  palette: {
    brand: {
      blue: '#143F90',
      sky: '#0275C9',
      green: '#05A552',
    },
    primary: {
      main: '#143F90',
      light: '#0275C9',
      dark: '#0f2c68',
    },
    secondary: {
      main: '#05A552',
      light: '#39c57a',
      dark: '#037f3d',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F9FAFB',
      heroOverlay: 'rgba(17, 24, 39, 0.35)',
    },
    text: {
      primary: gray[900],
      secondary: gray[600],
      disabled: gray[400],
      onDark: '#FFFFFF',
    },
    divider: gray[200],
    surface: {
      card: '#FFFFFF',
      nav: '#FFFFFF',
      chip: '#F3F4F6',
    },
    states: {
      hover: 'rgba(17, 24, 39, 0.04)',
      active: 'rgba(17, 24, 39, 0.08)',
    },
    gray,
  },
  typography: {
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    h1: {
      fontSize: '22px',
      fontWeight: 700,
      lineHeight: '32px',
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '28px',
    },
    subtitle1: {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: '26px',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    body3: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '18px',
    },
    caption: {
      fontSize: '10px',
      fontWeight: 400,
      lineHeight: '14px',
    },
  },
  spacing: (factor) => `${factor * baseSpacing}px`,
  shape: {
    borderRadiusLg: '20px',
    borderRadiusMd: '16px',
    borderRadiusSm: '12px',
    borderRadiusXs: '8px',
  },
  elevation: {
    card: '0 10px 30px rgba(15, 23, 42, 0.08)',
    nav: '0 -4px 20px rgba(15, 23, 42, 0.12)',
  },
  breakpoints: {
    tablet: '768px',
    desktop: '1024px',
  },
};

type TypographyKey = Exclude<keyof DefaultTheme['typography'], 'fontFamily'>;

export const typographyMixin = (variant: TypographyKey) => css`
  font-size: ${({ theme }) => theme.typography[variant].fontSize};
  font-weight: ${({ theme }) => theme.typography[variant].fontWeight};
  line-height: ${({ theme }) => theme.typography[variant].lineHeight};
  ${({ theme }) =>
    theme.typography[variant].letterSpacing
      ? `letter-spacing: ${theme.typography[variant].letterSpacing};`
      : ''}
`;

export default theme;
