module.exports = {
  purge: [],
  // purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false,
  theme: {
    extend: {
      width: {
        modal: '85%'
      },

      maxWidth: {
        modal: '420px'
      },

      placeholderColor: {
        text: {
          default: 'var(--color-text-default)'
        }
      },

      colors: {
        orange: {
          default: 'var(--color-orange-default)',
          accent: 'var(--color-orange-accent)'
        },
        pink: {
          default: 'var(--color-pink-default)',
          accent: 'var(--color-pink-accent)'
        },
        green: {
          default: 'var(--color-green-default)',
          accent: 'var(--color-green-accent)'
        },
        violet: {
          default: 'var(--color-violet-default)',
          accent: 'var(--color-violet-accent)'
        },
        blue: {
          default: 'var(--color-blue-default)',
          accent: 'var(--color-blue-accent)'
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
