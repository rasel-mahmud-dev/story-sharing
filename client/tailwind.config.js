module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class',
  theme: {
    extend: {
      fontSize: {
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        md: ['18px', '25px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
      },
      colors: {
        "primary": "#6f72d8",
        "nav-light": "rgb(248, 248, 248)",
        gray: {
          "9": "#eeeeee",
          "10": "#f5f5f5",
        },
        "gray-dark": {
          "9": "#8c8c8c"
        },
        dark: {
          900: "#131313",
          800: "#262626",
          700: "#2d2d2d",
          600: "#3d3d3d",
          500: "#484848",
          400: "#646464",
          300: "#737373",
          200: "#8a8a8a",
          100: "#8c8c8c",
          50: "#939393",
          10: "#b2b2b2",
          0: "#d0d0d0"

        }
      },
      width: {
        100: "100px",
        85: "85px",
        '80%': "80%",
        '95%': "95%",
        '200': "200px",
        '300': '300px'
      },
      height: {
        '200': "200px"
      },
      maxWidth: {
        "full": "100%"
      },
      minWidth: {
        85: "85px",
        100: "100px",
        150: "150px",
        200: "200px",
        300: "300px",
        900: "900px",
        1000: "1000px"
      },
      minHeight: {
        40: "40px"
      },
      zIndex: {
        500: "500",
      }
    },
  },
  plugins: [],
}
