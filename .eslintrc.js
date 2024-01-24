// eslint-disable-next-line @typescript-eslint/no-var-requires
const blitzConfig = require("@blitzjs/next/eslint")

const eslintConfig = {
  ...blitzConfig,
  extends: [...blitzConfig.extends, "plugin:@typescript-eslint/recommended"],
  ignorePatterns: [...blitzConfig.ignorePatterns, "templates/", "db/types/enums.ts"],
  rules: {
    ...blitzConfig.rules,
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
  },
  env: {
    jest: true,
  },
}

module.exports = eslintConfig
