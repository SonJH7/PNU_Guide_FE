import 'styled-components';

type TypographyVariant = {
  fontSize: string;
  fontWeight: number;
  lineHeight: number | string;
  letterSpacing?: string;
};

type GrayScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      brand: { blue: string; sky: string; green: string };
      primary: { main: string; light: string; dark: string };
      secondary: { main: string; light: string; dark: string };
      background: { default: string; paper: string; heroOverlay: string };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
        onDark: string;
      };
      divider: string;
      surface: { card: string; nav: string; chip: string };
      states: { hover: string; active: string };
      gray: GrayScale;
    };
    typography: {
      fontFamily: string;
      h1: TypographyVariant;
      h2: TypographyVariant;
      subtitle1: TypographyVariant;
      body1: TypographyVariant;
      body2: TypographyVariant;
      body3: TypographyVariant;
      caption: TypographyVariant;
    };
    spacing: (factor: number) => string;
    shape: {
      borderRadiusLg: string;
      borderRadiusMd: string;
      borderRadiusSm: string;
      borderRadiusXs: string;
    };
    elevation: {
      card: string;
      nav: string;
    };
    breakpoints: {
      tablet: string;
      desktop: string;
    };
  }
}
