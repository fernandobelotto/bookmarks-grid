import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react],
  ignorePatterns: core.ignorePatterns,
  rules: {
    // Owner preference: components are written as arrow functions.
    "func-style": "off",
    "react/function-component-definition": "off",
  },
});
