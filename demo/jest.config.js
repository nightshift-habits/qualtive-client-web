module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/src/@types/"],
  collectCoverageFrom: ["src/**/*.{tsx,ts,js}"],
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "\\.(scss|css)$": "<rootDir>/src/__mocks__/styleMock.js",
    "\\.(svg|jpg|png|gif)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
}
