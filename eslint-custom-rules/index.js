import kebabCaseAttributeValue from './rules/kebab-case-attribute-value.js'

const plugin = {
  meta: {
    name: 'eslint-plugin-custom',
    version: '1.0.0',
    namespace: 'custom'
  },
  rules: {
    'kebab-case-attribute-value': kebabCaseAttributeValue
  }
}

export default plugin
