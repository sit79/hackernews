module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["plugin:react/recommended", "eslint:recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: [2, "never"],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-console": [1]
  },
  settings: {
    react: {
      version: require("./package.json").dependencies.react
    }
  }
};
