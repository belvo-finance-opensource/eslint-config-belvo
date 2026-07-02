import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginCypress from 'eslint-plugin-cypress/flat'
import stylistic from '@stylistic/eslint-plugin'
import unusedImports from 'eslint-plugin-unused-imports'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import customEslintRules from './eslint-custom-rules/index.js'
import packageJson from 'eslint-plugin-package-json'
import parserJsonc from 'jsonc-eslint-parser'

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}']
    },
    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
    },
    ...pluginVue.configs['flat/strongly-recommended'],
    vueTsConfigs.recommended,
    {
        ...pluginCypress.configs.recommended,
        files: [
            '**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
            'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
            'cypress/support/**/*.{js,ts,jsx,tsx}'
        ]
    },
    {
        plugins: {
            '@stylistic': stylistic,
            'unused-imports': unusedImports,
            'no-only-tests': noOnlyTests,
            custom: customEslintRules,
            'package-json': packageJson
        },
        rules: {
            curly: 'error',
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',
            '@stylistic/indent': ['error', 2],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            'no-only-tests/no-only-tests': 'error',
            'vue/object-curly-spacing': ['error', 'always'],
            'vue/custom-event-name-casing': ['error', 'kebab-case'],
            'template-curly-spacing': ['error', 'never'],
            'unused-imports/no-unused-imports': 'error',
            'vue/singleline-html-element-content-newline': [
                'error',
                {
                    ignoreWhenNoAttributes: true,
                    ignoreWhenEmpty: true
                }
            ],
            'vue/multi-word-component-names': 'warn',
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: {
                        max: 2
                    },
                    multiline: {
                        max: 1
                    }
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'func-style': ['error', 'expression', { allowArrowFunctions: true }],
            'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'FunctionDeclaration',
                    message: 'Use arrow functions assigned to const instead: const name = () => {}'
                },
                {
                    selector: 'ExportDefaultDeclaration > FunctionDeclaration',
                    message: 'Use arrow functions assigned to const instead: const name = () => {}'
                },
                {
                    selector: 'VariableDeclaration[kind!="const"] > VariableDeclarator > ArrowFunctionExpression',
                    message: 'Assign arrow functions to const instead: const name = () => {}'
                },
                {
                    selector: 'VariableDeclarator > FunctionExpression',
                    message: 'Use arrow functions assigned to const instead: const name = () => {}'
                }
            ],
            'custom/kebab-case-attribute-value': 'error',
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                  allowShortCircuit: true,
                  allowTernary: true,
                  allowTaggedTemplates: true
                }
            ]
        }
    },
    eslintConfigPrettier,
    {
      name: 'app/curly-after-prettier',
      rules: {
        curly: 'error'
      }
    },
    packageJson.configs.recommended,
    {
        rules: {
            'package-json/specify-peers-locally': 'off',
            'package-json/require-sideEffects': 'off',
            'package-json/require-repository': 'off',
            'package-json/restrict-dependency-ranges': 'off'
        }
    },
    {
        name: 'app/package-json-custom-rules',
        files: ['**/package.json'],
        languageOptions: {
            parser: parserJsonc
        },
        plugins: {
            custom: customEslintRules
        },
        rules: {
            'custom/fixed-dependency-version': 'error'
        }
    }
)
