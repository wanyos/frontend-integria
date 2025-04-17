import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginPrettier from 'eslint-plugin-prettier'
import eslintPluginComments from '@eslint-community/eslint-plugin-eslint-comments'

const prettierPluginConfig = {
  plugins: {
    prettier: pluginPrettier
  },
  rules: {
    'prettier/prettier': 'warn'
  }
}

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly'
      }
    }
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  prettierPluginConfig, // Añadimos la configuración de Prettier
  eslintPluginComments.configs.recommended, // Útil para gestionar comentarios

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/tests/*']
  },

  {
    ...pluginCypress.configs.recommended,
    files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}']
  },

  {
    name: 'custom-rules',
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 0,
      'no-undef': 'off'
    }
  }
]
