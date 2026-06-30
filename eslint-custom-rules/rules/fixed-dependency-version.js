/**
 * @fileoverview Require fixed (exact) versions for package.json dependencies
 */
'use strict'

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
  'overrides'
]

const PACKAGE_JSON_PATTERN = /(?:^|[/\\])package\.json$/

function isPackageJson(filename) {
  return PACKAGE_JSON_PATTERN.test(filename)
}

function isJSONStringLiteral(node) {
  return node.type === 'JSONLiteral' && typeof node.value === 'string'
}

/**
 * Returns true when the version is a caret semver range (e.g. ^1.2.3).
 */
function isCaretVersion(version) {
  return /^\^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(version)
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
      description:
        'Require fixed (exact) versions for package.json dependencies; peerDependencies may use caret ranges (^)',
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
      mustBeFixed: '"{{name}}" must use a fixed version (e.g. "1.2.3"), not a range like "{{version}}".',
      peerMustBeFixedOrCaret:
        '"{{name}}" must use a fixed version (e.g. "1.2.3") or a caret range (e.g. "^1.2.3"), not "{{version}}".'
    }
  },

  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    if (!isPackageJson(context.filename)) {
      return {}
    }

    const options = context.options[0] ?? {}
    const dependencyTypes = options.forDependencyTypes ?? DEPENDENCY_TYPES

    function reportInvalidVersion(name, versionNode, dependencyType) {
      context.report({
        node: versionNode,
        messageId: dependencyType === 'peerDependencies' ? 'peerMustBeFixedOrCaret' : 'mustBeFixed',
        data: {
          name,
          version: versionNode.value
        }
      })
    }

    function isValidVersion(version, dependencyType) {
      if (dependencyType === 'peerDependencies') {
        return isFixedVersion(version) || isCaretVersion(version)
      }

      return isFixedVersion(version)
    }

    function checkOverridesObject(objectNode, namePrefix) {
      for (const property of objectNode.properties) {
        if (!isJSONStringLiteral(property.key)) {
          continue
        }

        const key = property.key.value
        const name = namePrefix ? `${namePrefix}.${key}` : key

        if (isJSONStringLiteral(property.value)) {
          if (!isFixedVersion(property.value.value)) {
            reportInvalidVersion(`overrides.${name}`, property.value, 'overrides')
          }
          continue
        }

        if (property.value.type === 'JSONObjectExpression') {
          checkOverridesObject(property.value, name)
        }
      }
    }

    function checkFlatDependencies(objectNode, dependencyType) {
      for (const property of objectNode.properties) {
        if (!isJSONStringLiteral(property.key) || !isJSONStringLiteral(property.value)) {
          continue
        }

        const name = property.key.value
        const version = property.value.value

        if (isValidVersion(version, dependencyType)) {
          continue
        }

        reportInvalidVersion(name, property.value, dependencyType)
      }
    }

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression]'(
        node
      ) {
        const dependencyType = node.key.value

        if (!dependencyTypes.includes(dependencyType)) {
          return
        }

        if (dependencyType === 'overrides') {
          checkOverridesObject(node.value, '')
          return
        }

        checkFlatDependencies(node.value, dependencyType)
      }
    }
  }
}
