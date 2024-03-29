module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
}
