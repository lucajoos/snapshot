module.exports = {
  purge: [],
  // purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false,
  theme: {
    extend: {
      minWidth: {
        modal: '37.5%'
      },

      placeholderColor: {
        text: {
          default: 'var(--color-text-default)'
        }
      },

      colors: {
        orange: {
          default: 'var(--color-orange-default)'
        },
        pink: {
          default: 'var(--color-pink-default)'
        },
        green: {
          default: 'var(--color-green-default)'
        },
        violet: {
          default: 'var(--color-violet-default)'
        },
        blue: {
          default: 'var(--color-blue-default)'
        },
        background: {
          default: 'var(--color-background-default)',
          accent: 'var(--color-background-accent)'
        },
        text: {
          default: 'var(--color-text-default)',
          accent: 'var(--color-text-accent)'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
