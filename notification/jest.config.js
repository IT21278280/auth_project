module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      '**/*.js',
      '!**/node_modules/**',
      '!**/coverage/**',
      '!jest.config.js',
      '!index.js', // Exclude index.js
    ],
  };