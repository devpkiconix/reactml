module.exports = {
  "roots": [
    "./src"
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    "<rootDir>/src/__tests__/data/",
    "<rootDir>/src/__tests__/pending/"
  ]
};