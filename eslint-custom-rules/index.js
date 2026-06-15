import kebabCaseAttributeValue from './rules/kebab-case-attribute-value.js'
import fixedDependencyVersion from './rules/fixed-dependency-version.js'

const plugin = {
  meta: {
    name: 'eslint-plugin-custom',
    version: '1.0.0',
    namespace: 'custom'
  },
  rules: {
    'kebab-case-attribute-value': kebabCaseAttributeValue,
    'fixed-dependency-version': fixedDependencyVersion
  }
}

export default plugin
