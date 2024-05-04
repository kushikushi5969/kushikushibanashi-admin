import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background_black: '#121212',
        background_white: '#f9f9f9',
      },
    },
  },
  plugins: [],
}

export default config
