module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|react-router-dom|styled-components)/)'
  ],
  moduleNameMapper: {
    '^axios$': '<rootDir>/src/__mocks__/axios.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jsdom'
};