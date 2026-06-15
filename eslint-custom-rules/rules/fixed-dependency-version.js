/**
 * @fileoverview Require fixed (exact) versions for package.json dependencies
 */
'use strict'

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]

const PACKAGE_JSON_PATTERN = /(?:^|[/\\])package\.json$/

function isPackageJson(filename) {
  return PACKAGE_JSON_PATTERN.test(filename)
}

function isJSONStringLiteral(node) {
  return node.type === 'JSONLiteral' && typeof node.value === 'string'
}

/**
 * Returns true when the version is an exact semver (no ranges like ^, ~, >=).
 */
function isFixedVersion(version) {
  if (version === '*') {
    return false
  }

  if (version.startsWith('workspace:')) {
    const workspaceVersion = version.slice('workspace:'.length)

    if (workspaceVersion === '*') {
      return false
    }

    return isFixedVersion(workspaceVersion)
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(version)) {
    return true
  }

  if (/^(\^|~|>=|>|<=|<)/.test(version)) {
    return false
  }

  return /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(version)
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require fixed (exact) versions for package.json dependencies',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          forDependencyTypes: {
            type: 'array',
            items: {
              enum: DEPENDENCY_TYPES
            }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      mustBeFixed: 'Dependency "{{name}}" must use a fixed version (e.g. "1.2.3"), not a range like "{{version}}".'
    }
  },

  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    if (!isPackageJson(context.filename)) {
      return {}
    }

    const options = context.options[0] ?? {}
    const dependencyTypes = options.forDependencyTypes ?? DEPENDENCY_TYPES

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression]'(
        node
      ) {
        const dependencyType = node.key.value

        if (!dependencyTypes.includes(dependencyType)) {
          return
        }

        for (const property of node.value.properties) {
          if (!isJSONStringLiteral(property.key) || !isJSONStringLiteral(property.value)) {
            continue
          }

          const name = property.key.value
          const version = property.value.value

          if (isFixedVersion(version)) {
            continue
          }

          context.report({
            node: property.value,
            messageId: 'mustBeFixed',
            data: {
              name,
              version
            }
          })
        }
      }
    }
  }
}
