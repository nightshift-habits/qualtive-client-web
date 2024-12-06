const path = require("path")

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      type: "umd",
      name: "qualtive",
    },
    globalObject: "this",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      src: path.resolve(__dirname, "src/"),
      "src/form/jsx/jsx-runtime": path.resolve(__dirname, "qualtive-client-web-jsx/jsx-runtime"),
      "src/form/jsx": path.resolve(__dirname, "qualtive-client-web-jsx"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  throwIfNamespace: false,
                  runtime: "automatic",
                  importSource: "qualtive-client-web-jsx",
                },
              ],
            ],
          },
        },
      },
    ],
  },
  stats: {
    errorDetails: true,
  },
}
