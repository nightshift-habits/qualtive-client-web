import { Enquiry, EnquiryThemeFontCustom } from "../../types"
import { _styles } from "../styles"
import type { RenderEnquiryOptions } from "../types"

export function renderStyles(options: RenderEnquiryOptions | undefined, enquiry: Enquiry | null): HTMLStyleElement {
  const styleElement = document.createElement("style")
  let computedStyle = _styles.core
  if (!options?.darkMode || options.darkMode == "auto") {
    computedStyle += "@media (prefers-color-scheme:dark){" + _styles.dark + "}"
  } else if (options?.darkMode == "always") {
    computedStyle += _styles.dark
  }
  if (enquiry?.theme.font.type === "custom") {
    computedStyle += customFontStyle(enquiry.theme.font)
  }
  styleElement.innerHTML = computedStyle
  document.head.appendChild(styleElement)
  return styleElement
}

export function customFontStyle(customFont: EnquiryThemeFontCustom): string {
  return `@font-face {
      font-family: QC;
      font-weight: 600;
      src: url(${customFont.url});
      font-display: swap;
    }`
}
