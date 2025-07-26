import { Enquiry, EnquiryThemeFont } from "../../types"
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
  computedStyle += customFontStyle(enquiry?.theme.font)
  styleElement.innerHTML = computedStyle
  document.head.appendChild(styleElement)
  return styleElement
}

export function customFontStyle(font: EnquiryThemeFont | null | undefined): string {
  switch (font?.type) {
    case "custom":
      return `@font-face {
  font-family: QB;
  font-weight: 600;
  src: url(${font.url});
  font-display: swap;
}`
    case "predefined":
      switch (font.value) {
        case "heptaSlab":
          return `@font-face {
  font-family: QB;
  font-weight: 600;
  src: url(https://static.qualtive.io/fonts/HeptaSlab-SemiBold.ttf);
  font-display: swap;
}`
      }
    // eslint-disable-next-line no-fallthrough
    default:
      return `@font-face {
  font-family: QB;
  font-weight: 600;
  src: url(https://static.qualtive.io/fonts/Poppins-SemiBold.ttf);
  font-display: swap;
}
@font-face {
  font-family: QB;
  font-weight: 400;
  src: url(https://static.qualtive.io/fonts/Poppins-Regular.ttf);
  font-display: swap;
}`
  }
}
