import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        whitePale: '#f5f5f5',
        black: '#121212',
        grayLight: '#272727',
      },
    },
  },
  plugins: [],
}

export default config
