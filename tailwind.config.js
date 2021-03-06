const _ = require('lodash');
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette')
  .default;

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        h1: '1.25rem', //         ~18px
        h2: '1rem', //            ~16px
        h3: '0.875rem', //        ~14px
        h4: '.75rem', //          ~12px
        body: '.9375rem', //      ~15px
        bodysm: '.835rem', //      ~13px
        bodyxsm: '.65rem', //      ~10px
      },
      maxHeight: {
        sm: '2rem',
        md: '4rem',
        lg: '6rem',
        xl: '8rem',
      },
      minHeight: {
        sm: '2rem',
        md: '4rem',
        lg: '6rem',
        xl: '8rem',
      },
      fontWeight: {
        h1: '600',
        h2: '700',
        h3: '700',
        h4: '700',
        body: '400',
        bodysm: '400',
      },
      colors: {
        primary: {
          light: '#fece09',
          dark: '#f79820',
        },
        // until maria sets us up w/ colors
        scripts: {
          inbound: '#CCEBFF',
          outbound: '#13E768',
          calldown: '#FFDC68',
        },
        'crisiscleanup-dark': {
          100: '#dadada',
          200: '#b8b8b8',
          300: '#818181',
          400: '#555555',
          500: '#2d2d2d',
        },
        'crisiscleanup-green': {
          100: '#13E768',
          200: '#11DD60',
          300: '#0ED258',
          400: '#0CC850',
          500: '#0ABD48',
          600: '#07B33F',
          700: '#05A837',
          800: '#029E2F',
          900: '#009327',
        },
        'crisiscleanup-red': {
          100: '#FF6C70',
          200: '#F95F62',
          300: '#F35154',
          400: '#ED4446',
          500: '#E73638',
          600: '#E0292A',
          700: '#DA1B1C',
          800: '#D40E0E',
          900: '#CE0000',
        },
        'crisiscleanup-yellow': {
          100: '#FFDC68',
          200: '#FFD55D',
          300: '#FFCE51',
          400: '#FFC746',
          500: '#FFC03B',
          600: '#FFB92F',
          700: '#FFB224',
          800: '#FFAB18',
          900: '#FFA40D',
        },
        'crisiscleanup-lightblue': {
          100: '#8EEBFF',
          200: '#7CE5FC',
          300: '#6BDFF9',
          400: '#59D9F6',
          500: '#47D3F3',
          600: '#35CDF0',
          700: '#24C7ED',
          800: '#12C1EA',
          900: '#00BBE7',
        },
        'crisiscleanup-grey': {
          100: '#D8D8D8',
          200: '#D0D0D0',
          300: '#C9C9C9',
          400: '#C1C1C1',
          500: '#BABABA',
          600: '#B2B2B2',
          700: '#AAAAAA',
          800: '#A3A3A3',
          900: '#9B9B9B',
        },
        'crisiscleanup-teal': '#4fbdb0',
        'crisiscleanup-dark-red': '#ed4747',
        'crisiscleanup-dark-blue': '#009bff',
        'crisiscleanup-light-grey': '#f9f9f9',
        'crisiscleanup-light-smoke': '#f2f3f4',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '108': '27rem',
        '120': '30rem',
      },
      boxShadow: {
        'crisiscleanup-card': '0 0 14px 0 rgba(164, 177, 184, 0.18)',
      },
    },
  },
  variants: {},
  plugins: [
    function ({ addUtilities, e, theme, variants }) {
      const colors = flattenColorPalette(theme('borderColor'));

      const utilities = _.flatMap(
        _.omit(colors, 'default'),
        (value, modifier) => ({
          [`.${e(`border-t-${modifier}`)}`]: { borderTopColor: `${value}` },
          [`.${e(`border-r-${modifier}`)}`]: { borderRightColor: `${value}` },
          [`.${e(`border-b-${modifier}`)}`]: { borderBottomColor: `${value}` },
          [`.${e(`border-l-${modifier}`)}`]: { borderLeftColor: `${value}` },
        }),
      );

      addUtilities(utilities, variants('borderColor'));
    },
  ],
};
