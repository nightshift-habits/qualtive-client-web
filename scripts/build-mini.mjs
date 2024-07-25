import path from "path"
import fs from "fs/promises"
import { bundle } from "bunchee"

const outputPath = path.resolve("./mini.js")
const publicProperties = ["uploadAttachment", "present", "post", "getQuestion", "getEnquiry"]

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

// Modify output
// - Remove unnecessary additions
// - Wrap everything in a qualtive-object
let output = await fs.readFile(path.resolve("./dist/index.js"), "utf8")

output = output
  .replace(`Object.defineProperty(exports, '__esModule', { value: true });`, "")
  .replace(/exports\.(\w+)\s*=\s*\1;/g, "")

output = `window.qualtive = (() => {
    ${output}
    return {
        ${publicProperties.join(",")}
    }
})();`

// Write output
await fs.writeFile(outputPath, output, "utf8")

console.info(`Done. Size: ${output.length}`)
