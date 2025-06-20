module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  rules: {
    "vue/multi-word-component-names": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        semi: false,
        singleQuote: true,
        trailingComma: "none",
      },
    ],
  },
};
