// jest.config.cjs
module.exports = {
  rootDir: './',
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!node-fetch)" // Include node-fetch in the transformation
  ],
  moduleFileExtensions: ["js", "jsx", "mjs"], // Add "mjs" to the list of module file extensions
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};