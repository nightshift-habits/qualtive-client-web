import path from "path"
import fs from "fs/promises"
import { bundle } from "bunchee"

const outputPath = path.resolve("./mini.js")
const publicProperties = ["uploadAttachment", "present", "post", "getQuestion", "getEnquiry", "renderEnquiry"]

// Bundle everything into a single JS-file
await bundle(path.resolve("./src/index.ts"), {
  dts: false,
  watch: false,
  minify: false,
  sourcemap: false,
  external: [],
  format: "cjs",
  target: "es2015",
  runtime: "browser",
  cwd: process.cwd(),
  clean: true,
})

const jsxRuntime =
  (await fs.readFile(path.resolve("./qualtive-client-web-jsx/jsx-runtime.js"), "utf8")).replace(
    /export\s+const\s+([a-zA-Z_$][\w$]*)\s*=\s*(.*)?/g,
    "",
  ) + `const jsx = renderJSX; const jsxs = jsx;`

// Modify output
// - Remove unnecessary additions
// - Wrap everything in a qualtive-object
// - Embedd JSX runtime
let output = await fs.readFile(path.resolve("./dist/index.js"), "utf8")

output = output
  .replace(`Object.defineProperty(exports, '__esModule', { value: true });`, "")
  .replace(/exports\.(\w+)\s*=\s*\1;/g, "")
  .replace(/var jsxRuntimeJsx = require\('\.\/jsx-runtime-jsx-[A-Za-z0-9]+\.js'\)/, ``)
  .replace(/jsxRuntimeJsx\./g, "")

output = `window.qualtive = (() => {
    ${jsxRuntime}
    ${output}
    return {
        ${publicProperties.join(",")}
    }
})();`

// Write output
await fs.writeFile(outputPath, output, "utf8")

console.info(`Done. Size: ${output.length}`)
