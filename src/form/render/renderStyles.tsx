import { _styles } from "../styles"
import type { RenderEnquiryOptions } from "../types"

export function renderStyles(options: RenderEnquiryOptions | undefined) {
  const styleElement = document.createElement("style")
  let computedStyle = _styles.core
  if (!options?.darkMode || options.darkMode == "auto") {
    computedStyle += "@media (prefers-color-scheme:dark){" + _styles.dark + "}"
  } else if (options?.darkMode == "always") {
    computedStyle += _styles.dark
  }
  styleElement.innerHTML = computedStyle
  document.head.appendChild(styleElement)
  return styleElement
}
