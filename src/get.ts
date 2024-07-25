import type { Enquiry, Question, _Options } from "./model"
import { _parseCollection } from "./collection"
import { _fetch } from "./networking"

/**
 * Optional options to use when fetching feedback question using custom UI.
 */
export type GetQuestionOptions = _Options

/**
 * Fetches a question and it's structure.
 * @param collection Collection to get question from. Formatted as `container-id/question-id`. Required.
 * @param options Optional options.
 * @returns Promise<Question>
 * @deprecated Use getEnquiry instead.
 */
export const getQuestion = (collection: string, options?: GetQuestionOptions): Promise<Question> => {
  const collectionComponents = _parseCollection(collection)
  const containerId = collectionComponents[0]
  const questionId = collectionComponents[1]

  return _fetch({
    ...(options || {}),
    method: "GET",
    path: `/feedback/questions/${questionId}/`,
    containerId,
  })
}

/**
 * Optional options to use when fetching feedback question using custom UI.
 */
export type GetEnquiryOptions = _Options

/**
 * Fetches a enquiry and it's structure.
 * @param collection Collection to get enquiry. Formatted as `container-id/enquiry-id-or-slug`. Required.
 * @param options Optional options.
 * @returns Promise<Enquiry>
 */
export const getEnquiry = (collection: string, options?: GetEnquiryOptions): Promise<Enquiry> => {
  const [containerId, enquiryId] = _parseCollection(collection)

  return _fetch({
    ...(options || {}),
    method: "GET",
    path: `/feedback/enquiries/${enquiryId}/`,
    containerId,
  })
}
