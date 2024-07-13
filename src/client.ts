import { type PostOptions } from "./post"

export const _clientId = (options: PostOptions | undefined): string | undefined => {
  const rand = (length: number): string => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  // Consent?
  switch (options?.userTrackingConsent || "granted") {
    case "granted": {
      // Already a stored id?
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

      // Generate new id
      const clientId = rand(15)

      // Store it
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
    case "denied":
      return undefined
    default:
      console.warn(
        `Qualtive: \`userTrackingConsent\` has a unexpected value of "${options?.userTrackingConsent}". Fallbacking to "denied".`,
      )
      return undefined
  }
}

export const _hasTouch = (): boolean => {
  try {
    document.createEvent("TouchEvent")
    return true
  } catch (e) {
    return false
  }
}
