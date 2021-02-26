import { Entry, Options, EntryReference } from "./model"
import { getClientId, hasTouch, validateEntry, parseCollection } from "./private"

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/question-id`. Required.
 * @param entry User entry to post. Required.
 * @param options Optional options for posting.
 * @returns Promise<EntryReference>
 */
export const post = (collection: string, entry: Entry, options?: Options): Promise<EntryReference> => {
  return new Promise((resolve, reject) => {
    let containerId: string, questionId: string
    try {
      const collectionComponents = parseCollection(collection)
      containerId = collectionComponents[0]
      questionId = collectionComponents[1]

      validateEntry(entry)
    } catch (error) {
      reject(error)
      return
    }

    const fallbackErrorReason = "Could not complete operation."

    const request = new XMLHttpRequest()
    request.onload = () => {
      let json: unknown
      try {
        json = JSON.parse(request.responseText)
      } catch (error) {
        if (request.status >= 400) {
          reject(new Error(fallbackErrorReason))
        } else {
          reject(error)
        }
        return
      }

      if (request.status >= 400) {
        reject((json as { reason?: string }).reason || fallbackErrorReason)
      } else {
        resolve(json as EntryReference)
      }
    }
    request.onerror = () => reject(new Error(request.statusText || fallbackErrorReason))

    const body = {
      questionId,
      score: entry.score,
      text: entry.text,
      user: {
        id: entry.user?.id?.toString(),
        name: entry.user?.name,
        email: entry.user?.email,
        clientId: getClientId(),
      },
      attributes: entry.customAttributes,
      attributeHints: {
        clientLibrary: "web",
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hasTouch: hasTouch(),
        screenSize: {
          width: window.screen.width,
          height: window.screen.height,
        },
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    }

    let url = options?._remoteUrl || "https://user-api.qualtive.io"
    url += "/1/entries/"
    request.open("POST", url, true)

    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.setRequestHeader("X-Container", containerId)

    request.send(JSON.stringify(body))
  })
}
