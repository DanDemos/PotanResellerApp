module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn'],
    'import/no-unresolved': ['error', { ignore: ['@env'] }],
  },
};
