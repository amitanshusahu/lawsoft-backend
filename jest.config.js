/** @type {import('jest').Config} */
const config = {
  // Required for ESM + TypeScript projects
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // This fixes "Cannot find module" when Jest adds .js extensions
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // NO transform needed — Jest 28+ + TS 5+ compile TS natively
  transform: {},

  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
};

module.exports = config;