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
