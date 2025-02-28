export default {
  testEnvironment: 'node',
  transform: {
      '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: ['**/test/**/*.test.js'],
  setupFiles: ['<rootDir>/backend/test/setup.js'],
};