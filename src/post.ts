import { Entry, _Options, EntryReference } from "./model"
import { getClientId, hasTouch, validateEntry, parseCollection } from "./private"
import { localized } from "./localized"

/**
 * Optional options to use when posting feedback using custom UI.
 */
export type PostOptions = _Options

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/question-id`. Required.
 * @param entry User entry to post. Required.
 * @param options Optional options for posting.
 * @returns Promise<EntryReference>
 */
export const post = (collection: string, entry: Entry, options?: PostOptions): Promise<EntryReference> => {
  return new Promise((resolve, reject) => {
    let containerId: string, questionId: string
    try {
      const collectionComponents = parseCollection(collection)
      containerId = collectionComponents[0]
      questionId = collectionComponents[1]

      validateEntry(entry)
    } catch (error) {
      return void reject(error)
    }

    const request = new XMLHttpRequest()
    request.onload = () => {
      let json: unknown
      try {
        json = JSON.parse(request.responseText)
      } catch (error) {
        if (request.status >= 400) {
          return void reject(new Error(localized("ops.fallback-error")))
        } else {
          return void reject(error)
        }
      }

      if (request.status >= 400) {
        reject((json as { reason?: string }).reason || localized("ops.fallback-error"))
      } else {
        resolve(json as EntryReference)
      }
    }
    request.onerror = () => reject(new Error(request.statusText || localized("ops.fallback-error")))

    const content = entry.content || []
    if (content.length == 0) {
      if (typeof entry.score === "number") {
        content.push({
          type: "score",
          value: entry.score,
          scoreType: "smilies5",
          leadingText: null,
          trailingText: null,
        })
      }
      if (typeof entry.text === "string") {
        content.push({
          type: "text",
          value: entry.text,
        })
      }
    }

    const body = {
      questionId,
      content,
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
        locale: options?.locale || navigator.language || undefined,
      },
    }

    let url = options?._remoteUrl || "https://user-api.qualtive.io"
    url += "/feedback/entries/"
    request.open("POST", url, true)

    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.setRequestHeader("X-Container", containerId)

    request.send(JSON.stringify(body))
  })
}
