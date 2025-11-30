/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      white: '#FFFFFF',
      gray: {
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
      },
      brand: {
        blue: '#143F90',
        sky: '#0275C9',
        green: '#05A552',
      },
      background: {
        default: '#FFFFFF',
        muted: '#F9FAFB',
        fill: '#F3F4F6',
      },
      text: {
        default: '#111827',
        sub: '#4B5563',
        disabled: '#9CA3AF',
        placeholder: '#9CA3AF',
      },
      border: {
        default: '#E5E7EB',
        disabled: '#F3F4F6',
      },
      state: {
        critical: '#FA342C',
        criticalBackground: '#FDF0F0',
        info: '#0275C9',
        infoBackground: '#EFF6FF',
        success: '#05A552',
        successBackground: '#E8F5ED',
      },
    },

    fontFamily: {
      sans: ['Pretendard', 'system-ui', 'sans-serif'],
    },

    fontSize: {
      h1: ['1.375rem', { lineHeight: '2rem', fontWeight: '700' }],
      h2: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
      subtitle1: ['1.125rem', { lineHeight: '1.625rem', fontWeight: '500' }],
      body1: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
      body2: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      body3: ['0.75rem', { lineHeight: '1.125rem', fontWeight: '400' }],
      caption: ['0.625rem', { lineHeight: '0.875rem', fontWeight: '400' }],
    },

    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      13: '52px',
      14: '56px',
      15: '60px',
      16: '64px',
    },
  },
};
