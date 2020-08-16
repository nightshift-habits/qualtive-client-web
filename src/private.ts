import { Entry } from "./model"

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

  // Score
  if (typeof entry.score != "number") throw Error("Score must be a number between 0 and 100")
  if (entry.score < 0 || entry.score > 100) throw Error("Score must be a number between 0 and 100")

  // Text
  if (typeof entry.text != "string" && entry.text) throw Error("Text must be a string, null or undefined")

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
