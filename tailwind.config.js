const colors = {
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

module.exports = {
  purge: {
    content: ['./src/**/*.jsx'],
    options: {
      safelist: [].concat(...Object.keys(colors).map(color => {
        return [
          `bg-${color}-default`,
          `bg-${color}-accent`,
          `hover:bg-${color}-accent`
        ]
      }))
    }
  },
  darkMode: false,
  theme: {
    extend: {
      margin: {
        empty: '110px'
      },

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

      colors
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
