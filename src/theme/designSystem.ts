import sharedTheme from '../../theme.js';

type FontEntry = [
  string,
  { lineHeight?: string; fontWeight?: number | string },
];

type TailwindTokens = {
  colors?: { gray?: Record<string, string> };
  fontFamily?: Record<string, string[]>;
  fontSize?: Record<string, FontEntry>;
  spacing?: Record<number, string>;
};

type SharedTheme = { theme?: TailwindTokens };

const tokens: TailwindTokens = (sharedTheme as SharedTheme)?.theme ?? {};

export const fontFamily =
  tokens.fontFamily?.sans?.join(', ') ?? 'Pretendard, system-ui, sans-serif';

export const spacing = (step: number) => {
  const value = tokens.spacing?.[step];
  return typeof value === 'string' ? value : `${step * 4}px`;
};

export const textStyle = (variant: string) => {
  const entry = tokens.fontSize?.[variant];
  if (!entry) return undefined;
  const [fontSize, meta] = entry;
  return {
    fontSize,
    lineHeight: meta?.lineHeight,
    fontWeight: meta?.fontWeight,
  };
};

export const grayColors = tokens.colors?.gray ?? {};
