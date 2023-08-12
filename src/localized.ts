import { _Options } from "./model"
import { strings } from "./strings"

export const _localized = (key: string, locale?: string): string => {
  locale = (locale || navigator?.language || "en-us").replace(/_/g, "-").toLowerCase()

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return strings[reversedLanguageFindKey]![key] || key
  }

  if (strings["en-us"]) {
    return strings["en-us"][key] || key
  }

  return key
}

export const _locale = (options: _Options | undefined): string => options?.locale || navigator?.language || "en-us"
