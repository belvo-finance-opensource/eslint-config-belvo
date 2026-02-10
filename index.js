import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginCypress from 'eslint-plugin-cypress/flat'
import stylistic from '@stylistic/eslint-plugin'
import unusedImports from 'eslint-plugin-unused-imports'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import customEslintRules from './eslint-custom-rules/index.js'
import packageJson from 'eslint-plugin-package-json'

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
    packageJson.configs.recommended,
    {
        rules: {
            'package-json/specify-peers-locally': 'off',
            'package-json/restrict-dependency-ranges': [
                'error',
                {
                    forDependencyTypes: ['devDependencies', 'dependencies'],
                    rangeType: 'pin'
                }
            ]
        }
    }
)
