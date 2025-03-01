import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
    '.*\\.(vue)$': './vue3JestHack.js',
  },
  moduleFileExtensions: ['vue', 'ts', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css)$': '<rootDir>/test/mocks/emptyMock.js',
    '^@vue/test-utils':
      '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js',
  },
  modulePathIgnorePatterns: ['node_modules'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  silent: true,
};

export default config;
