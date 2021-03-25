import { Question, _Options } from "./model"
import { parseCollection } from "./private"
import _ from "./localized"

/**
 * Optional options to use when fetching feedback question using custom UI.
 */
export type GetQuestionOptions = _Options

/**
 * Fetches a question and it's struction.
 * @param collection Collection to get question from. Formatted as `container-id/question-id`. Required.
 * @param options Optional options.
 * @returns Promise<Question>
 */
export const getQuestion = (collection: string, options?: GetQuestionOptions): Promise<Question> => {
  return new Promise((resolve, reject) => {
    let containerId: string, questionId: string
    try {
      const collectionComponents = parseCollection(collection)
      containerId = collectionComponents[0]
      questionId = collectionComponents[1]
    } catch (error) {
      reject(error)
      return
    }

    const request = new XMLHttpRequest()
    request.onload = () => {
      let json: unknown
      try {
        json = JSON.parse(request.responseText)
      } catch (error) {
        if (request.status >= 400) {
          reject(new Error(_("ops.fallback-error")))
        } else {
          reject(error)
        }
        return
      }

      if (request.status >= 400) {
        reject((json as { reason?: string }).reason || _("ops.fallback-error"))
      } else {
        resolve(json as Question)
      }
    }
    request.onerror = () => reject(new Error(request.statusText || _("ops.fallback-error")))

    let url = options?._remoteUrl || "https://user-api.qualtive.io"
    url += `/feedback/questions/${questionId}/`
    request.open("GET", url, true)

    request.setRequestHeader("X-Container", containerId)

    request.send()
  })
}
