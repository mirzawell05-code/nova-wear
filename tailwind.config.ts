import type { Config } from 'tailwindcss';
export default {
  content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme:{extend:{colors:{ink:'#1D1D1B',cream:'#F5F2ED',sand:'#E6DED4',stone:'#8B8680'},fontFamily:{sans:['Arial','Helvetica','sans-serif']},letterSpacing:{editorial:'-.055em'},transitionDuration:{400:'400ms'}}},
  plugins:[],
} satisfies Config;
