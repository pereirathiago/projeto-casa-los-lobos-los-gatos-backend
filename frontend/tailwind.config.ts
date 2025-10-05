import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ong-purple': 'var(--ong-purple)',
        'ong-orange': 'var(--ong-orange)',
      },
    },
  },
  plugins: [],
};

export default config;
