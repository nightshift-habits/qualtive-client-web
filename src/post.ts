import type { Entry, _Options, EntryReference, Collection } from "./types"
import { validateEntry } from "./entry"
import { _clientId, _hasTouch } from "./client"
import { _parseCollection } from "./collection"
import { _fetch } from "./networking"
import { resolve } from "./utils"

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
 * @param collection Collection to post to. Formatted as `container-id/enquiry-id-or-slug`. Required.
 * @param entry User entry to post. Required.
 * @param options Optional options for posting.
 * @returns Promise<EntryReference>
 */
export const post = (collection: Collection, entry: Entry, options?: PostOptions): Promise<EntryReference> => {
  const collectionComponents = _parseCollection(collection)
  const containerId = collectionComponents[0]
  const enquiryId = collectionComponents[1]

  return Promise.all([resolve(entry.user), resolve(entry.customAttributes)]).then(([user, customAttributes]) => {
    validateEntry({ ...entry, user, customAttributes })

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

    let references: { type: string; id: string }[] | undefined
    try {
      const cookie = document.cookie.match(/qualtiveREFs=([^;]+)/)?.[1]
      references = cookie ? JSON.parse(decodeURIComponent(cookie)) : []
    } catch (error) {
      console.error("Error parsing Qualtive references cookie", error)
    }

    const body = {
      questionId: /^-?\d+$/.test(enquiryId) ? parseInt(enquiryId) : enquiryId,
      content,
      user: {
        id: user?.id?.toString(),
        name: user?.name,
        email: user?.email,
        clientId: _clientId(options),
        timeZoneIdentifier,
      },
      attributes: customAttributes,
      attributeHints,
      source,
      references,
    }

    return _fetch<EntryReference>({
      ...(options || {}),
      method: "POST",
      path: "/feedback/entries/",
      containerId,
      body,
    }).then((entryReference) => {
      try {
        document.cookie = "qualtiveREFs=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      } catch (error) {
        console.error("Error deleting Qualtive references cookie", error)
      }
      return entryReference
    })
  })
}
