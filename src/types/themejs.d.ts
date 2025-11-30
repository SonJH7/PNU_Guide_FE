declare module '../../theme.js' {
  type FontEntry = [string, { lineHeight?: string; fontWeight?: number }];

  const config: {
    content: string[];
    theme: {
      colors: Record<string, unknown>;
      fontFamily: Record<string, string[]>;
      fontSize: Record<string, FontEntry>;
      spacing: Record<number, string>;
    };
  };

  export default config;
}

declare module '../../theme' {
  import config from '../../theme.js';
  export default config;
}
