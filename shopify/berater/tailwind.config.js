// Gekapselt: kein Preflight, Präfix tw-, alle Regeln nur unter .azb (dem Berater-Container).
export default {
  content: ['./src/**/*.{js,jsx}'],
  prefix: 'tw-',
  important: '.azb',
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        nacht: '#0b0a09',
        nacht2: '#141210',
        creme: '#efe6d6',
        grau: '#a39684',
        gold: '#d4bc8c',
        gold2: '#ecdcb6',
        golddunkel: '#a8895a',
      },
      fontFamily: {
        serif: ['var(--az-serif, Georgia, serif)'],
        sans: ['var(--az-sans, system-ui, sans-serif)'],
      },
    },
  },
};
