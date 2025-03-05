import { _Options } from "./types"
import { strings } from "./strings"

const _systemLocale: string | null = (() => {
  try {
    return navigator.language
  } catch {
    return null
  }
})()

export const _localized = (key: string, locale?: string): string => {
  locale = (locale || _systemLocale || "en-us").replace(/_/g, "-").toLowerCase()

  const directFind = strings[locale]
  if (directFind) {
    return directFind[key] || key
  }

  const languageFind = strings[locale.split("-")[0]]
  if (languageFind) {
    return languageFind[key] || key
  }

  const reversedLanguageFindKey = Object.keys(strings).find((x) => x.split("-")[0] == locale)
  if (reversedLanguageFindKey) {
    return strings[reversedLanguageFindKey]![key] || key
  }

  if (strings["en-us"]) {
    return strings["en-us"][key] || key
  }

  return key
}

export const _locale = (options: _Options | undefined): string => options?.locale || _systemLocale || "en-us"
