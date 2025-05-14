const nextJest = require('next/jest');

// Path to my Next.js app
const createJestConfig = nextJest({
  dir: './',
});

// Custom jest config to handle module paths, inline with my jsconfig.json
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

// Export a function to let Next.js handle it
module.exports = createJestConfig(customJestConfig);
