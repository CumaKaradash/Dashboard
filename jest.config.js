module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)'],
  transformIgnorePatterns: [
    '/node_modules/(?!(react|react-dom|@testing-library|@radix-ui|lucide-react)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
} 