/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@loyaltyflowai/logger$': '<rootDir>/../../packages/logger/src/index.ts',
    '^@loyaltyflowai/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@loyaltyflowai/config/server$': '<rootDir>/__tests__/__mocks__/config-server.ts',
    // jose v6 is ESM-only — map to its CJS-compatible build for Jest
    '^jose$': '<rootDir>/__tests__/__mocks__/jose.ts',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { strict: true } }],
  },
}
