# @belvo/eslint-config

Shareable ESLint config for Belvo FE projects.

---

## Installation

1. **Install required peer dependencies**

   Run this command to check which packages and versions you need:

   ```sh
   npm info "@belvo/eslint-config@latest" peerDependencies
   ```

   The easiest way is:

   ```sh
   npx install-peerdeps --dev @belvo/eslint-config
   ```

2. **Configure ESLint**

    - Using the new ESLint [flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new):

      ```js
      // eslint.config.js
      import belvoConfig from "@belvo/eslint-config";
      export default belvoConfig;
      ```

---

## Usage

This configuration provides Belvo-standard ESLint rules for frontend projects (Vue, TypeScript, Prettier, Cypress, and more).  
You can extend or override these rules in your own config as needed.

---

## Custom Rules

If you wish to use custom rules included in this package (in `eslint-custom-rules`), be sure to reference them in your project’s ESLint config.

---

## Updating

- To see current peers required:
  ```sh
  npm info "@belvo/eslint-config@latest" peerDependencies
  ```

- To interactively update your dependencies:
  ```sh
  npm run check-dependencies
  ```

---

## Resources

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Vue ESLint Config Guide](https://eslint.vuejs.org/user-guide/#using-predefined-configurations)
- [Prettier + ESLint](https://prettier.io/docs/en/integrating-with-linters.html)
