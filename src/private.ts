import { Entry, EntryContent } from "./model"

// --- Input validation ---

export const parseCollection = (collection: string): string[] => {
  if (typeof collection != "string")
    throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/question-id`")

  const components = collection.split("/")
  if (components.length != 2)
    throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/question-id`")

  if (!components[0]) throw Error("Invalid container id")
  if (!components[1]) throw Error("Invalid question id")

  return components
}

export const validateEntry = (entry: Entry): void => {
  if (typeof entry != "object" || entry == null) throw Error("Entry must be an object")

  if (Array.isArray(entry.content)) {
    if (entry.content.length == 0) throw Error("Content must be a non-empty array")

    entry.content.forEach((content, index) => {
      if (typeof content != "object") throw Error("Content must be an object")
      switch (content.type) {
        case "title":
          if (content.text != null && typeof content.text != "undefined" && typeof content.text != "string")
            throw Error(`Content ${index} (title) text must be a string, null or undefined`)
          return

        case "score":
          if (content.value != null && typeof content.value != "undefined" && typeof content.value != "number")
            throw Error(`Content ${index} (score) value must be a number, null or undefined`)
          if (typeof content.value == "number" && (content.value < 0 || content.value > 100))
            throw Error(`Content ${index} (score) value must be between 0 and 100`)
          return

        case "text":
          if (content.value != null && typeof content.value != "undefined" && typeof content.value != "string")
            throw Error(`Content ${index} (text) value must be a string, null or undefined`)
          return

        case "select":
          if (content.value != null && typeof content.value != "undefined" && typeof content.value != "string")
            throw Error(`Content ${index} (select) value must be a string, null or undefined`)
          return

        case "multiselect":
          if (!Array.isArray(content.values)) throw Error(`Content ${index} (multiselect) value must be an array`)
          content.values.forEach((x, index2) => {
            if (typeof x != "string") throw Error(`Content ${index} (multiselect) value ${index2}) must be a string`)
          })
          return
      }

      if (!(content as EntryContent).type) throw Error(`Content ${index} must have a type`)
      throw Error(`Content ${index} type is unsupported: ${(content as EntryContent).type}`)
    })
  } else {
    // Score
    const hasScore = !!entry.score || entry.score == 0
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (hasScore && (typeof entry.score != "number" || entry.score! < 0 || entry.score! > 100))
      throw Error("Score must be a number between 0 and 100")

    // Text
    const hasText = !!entry.text
    if (hasText && typeof entry.text != "string") throw Error("Text must be a string, null or undefined")

    if (!hasScore && !hasText) throw Error("Must set content or score or text")
  }

  // User
  if (typeof entry.user != "undefined" && entry.user != null) {
    if (typeof entry.user.id != "string" && typeof entry.user.id != "number")
      throw Error("User id must be string or number")
    if (entry.user.name && typeof entry.user.name != "string") throw Error("User name must be string")
    if (entry.user.email && typeof entry.user.email != "string") throw Error("User email must be string")
  }

  // Custom attributes
  if (typeof entry.customAttributes != "object" && entry.customAttributes)
    throw Error("Custom attributes must be an object, null or undefined")
}

export const parseCustomAttributes = (
  attributes: { [key: string]: string | number | boolean | null } | null | undefined
): { [key: string]: string } => {
  const result: { [key: string]: string } = {}
  if (!attributes) return result

  Object.entries(attributes).forEach(([key, value]) => {
    if (value == null) return

    if (typeof value != "string" && typeof value != "number" && typeof value != "boolean")
      throw Error("Custom attributes value must be a string, number or a boolean.")

    result[key] = value.toString()
  })

  return result
}

// --- Data ---

export const getClientId = (): string => {
  const rand = (length: number): string => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  const storageKey = "__qualtiveCID"
  try {
    const clientId = localStorage[storageKey]
    if (clientId && clientId.length) return clientId
  } catch {
    try {
      const clientId = sessionStorage[storageKey]
      if (clientId && clientId.length) return clientId
      // eslint-disable-next-line no-empty
    } catch {}
  }

  const clientId = rand(15)
  try {
    localStorage[storageKey] = clientId
  } catch {
    try {
      sessionStorage[storageKey] = clientId
      // eslint-disable-next-line no-empty
    } catch {}
  }
  return clientId
}

export const hasTouch = (): boolean => {
  try {
    document.createEvent("TouchEvent")
    return true
  } catch (e) {
    return false
  }
}
