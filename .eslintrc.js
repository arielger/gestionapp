const blitzConfig = require("@blitzjs/next/eslint")

const eslintConfig = {
  ...blitzConfig,
  extends: [...blitzConfig.extends, "eslint:recommended"],
  ignorePatterns: [...blitzConfig.ignorePatterns, "templates/"],
}

module.exports = eslintConfig
