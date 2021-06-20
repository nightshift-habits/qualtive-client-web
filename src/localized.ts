import { _Options } from "./model"
import { strings } from "./strings"

export const localized = (key: string, locale?: string): string => {
  locale = locale || navigator.language || "en-us"
  locale = locale.toLowerCase()
  return (strings[locale] || strings["en-us"])[key] || key
}

export const preferredLocale = (options: _Options | undefined): string =>
  options?.locale || navigator.language || "en-us"
