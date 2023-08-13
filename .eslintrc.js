module.exports = {
    root: true,
    extends: ["plugin:tailwindcss/recommended"],
    overrides: [
        {
          files: ['*.ts', '*.tsx', '*.js'],
          parser: '@typescript-eslint/parser',
        },
    ],
};