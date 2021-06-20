import { strings } from "./strings"

export const localized = (key: string, locale?: string): string => {
  locale = locale || navigator.language || "en-us"
  locale = locale.toLowerCase()
  return (strings[locale] || strings["en-us"])[key] || key
}
