/**
 * @fileoverview Enforce kebab-case for values of data-* attributes in Vue templates
 * @author Your Name
 */
'use strict'

import path from 'path'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce kebab-case for values of data-* attributes in Vue templates',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',
    hasSuggestions: false,
    schema: [],
    messages: {
      mustBeKebabCase: 'Data-* attribute values must be in kebab-case.',
      cannotBeKebabCase: 'Data-* attribute values cannot be in camelCase.'
    }
  },

  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()

    const toKebabCase = (str) => str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)

    function defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor, options) {
      const sourceCode = context.getSourceCode()
      if (sourceCode.parserServices.defineTemplateBodyVisitor == null) {
        const filename = context.getFilename()
        if (path.extname(filename) === '.vue') {
          context.report({
            loc: { line: 1, column: 0 },
            message:
              'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
          })
        }
        return {}
      }
      return sourceCode.parserServices.defineTemplateBodyVisitor(
        templateBodyVisitor,
        scriptVisitor,
        options
      )
    }

    // Report the issue with the node
    function reportIssue(node, name) {
      const text = sourceCode.getText(node.key)

      context.report({
        node: node.key,
        loc: node.loc,
        messageId: 'mustBeKebabCase',
        data: {
          text
        },
        fix: (fixer) => {
          if (text.includes('_')) {
            return null // Don't fix if the text contains underscores
          }

          return fixer.replaceText(node.key, text.replace(name, toKebabCase(name)))
        }
      })
    }

    // Helper function to determine if an attribute is a valid data-* attribute and if it needs fixing
    function isValidDataAttribute(name) {
      return typeof name === 'string' && name.startsWith('data-')
    }
    function isInKebabCase(value) {
      // Kebab-case: lowercase with hyphens
      return /^[a-z0-9-]+$/.test(value)
    }

    // Define the visitor for `VAttribute` nodes in Vue templates
    return defineTemplateBodyVisitor(context, {
      VAttribute(node) {
        const name = node.key.name
        const value = node.value && node.value.value
        // If it's a data-* attribute, and its value is not in kebab-case, report it
        if (isValidDataAttribute(name)) {
          if (value && !isInKebabCase(value)) {
            reportIssue(node, value)
          }
        }
      }
    })
  }
}
