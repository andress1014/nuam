/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.ts', '!**/src/**/*.type.ts'],
  coverageReporters: ['html', 'lcov', 'text'],
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testMatch: ['**/src/**/?(*.)+(spec).(ts)'],
  clearMocks: true,
  roots: ['<rootDir>/src/'],
  setupFiles: ['<rootDir>/.jest/setEnvVars.ts'],
  silent: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
