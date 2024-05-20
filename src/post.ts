import { Entry, _Options, EntryReference } from "./model"
import { validateEntry } from "./entry"
import { _clientId, _hasTouch } from "./client"
import { _parseCollection } from "./collection"
import { _fetch } from "./networking"

/**
 * Optional options to use when posting feedback using custom UI.
 */
export type PostOptions = _Options & {
  /**
   * Preference of metdata collected. Defaults to "nonPersonal".
   *
   * Possible values:
   * - "auto", undefined, null: Only non-personally identifiable metadata will be collected. E.g. browser.
   * - "none": No metadata will be collected.
   */
  metadataCollection?: "nonPersonal" | "none" | null
  /**
   * Preference of if user has consented to tracking. Defaults to "granted".
   *
   * Possible values:
   * - "granted", undefined, null: A unique id is stored on device to identify if the same user posts more feedback in the future.
   * - "denied": No unique id will be stored on device.
   */
  userTrackingConsent?: "granted" | "denied" | null
}

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/question-id`. Required.
 * @param entry User entry to post. Required.
 * @param options Optional options for posting.
 * @returns Promise<EntryReference>
 */
export const post = (collection: string, entry: Entry, options?: PostOptions): Promise<EntryReference> => {
  const collectionComponents = _parseCollection(collection)
  const containerId = collectionComponents[0]
  const questionId = collectionComponents[1]

  validateEntry(entry)

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let attributeHints: any = {
    clientLibrary: "web",
  }
  let source:
    | {
        webpageUrl?: string
      }
    | undefined
  switch (options?.metadataCollection || "nonPersonal") {
    case "nonPersonal":
      attributeHints = {
        ...attributeHints,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hasTouch: _hasTouch(),
        screenSize: {
          width: window.screen.width,
          height: window.screen.height,
        },
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        locale: options?.locale || navigator.language || undefined,
      }
      source = {
        webpageUrl: entry.source?.webpageUrl || window.location.href,
      }
      break
    case "none":
      break
    default:
      console.warn(
        `Qualtive: \`metadataCollection\` has a unexpected value of "${options?.metadataCollection}". Fallbacking to "none".`,
      )
      break
  }

  let timeZoneIdentifier: string | null
  try {
    timeZoneIdentifier = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    timeZoneIdentifier = null
  }

  const body = {
    questionId,
    content,
    user: {
      id: entry.user?.id?.toString(),
      name: entry.user?.name,
      email: entry.user?.email,
      clientId: _clientId(options),
      timeZoneIdentifier,
    },
    attributes: entry.customAttributes,
    attributeHints,
    source,
  }

  return _fetch({
    ...(options || {}),
    method: "POST",
    path: "/feedback/entries/",
    containerId,
    body,
  })
}
