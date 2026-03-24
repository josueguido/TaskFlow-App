const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  setupFiles: ['./src/tests/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // TODO: Remove this when proper tests with DB mocks are implemented
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec).[jt]s?(x)'],
};
