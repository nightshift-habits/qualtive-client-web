import type { Collection, Question, _Options } from "./types"
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
export const getQuestion = (collection: Collection, options?: GetQuestionOptions): Promise<Question> => {
  const [containerId, questionId] = _parseCollection(collection)

  return _fetch({
    ...(options || {}),
    method: "GET",
    path: `/feedback/questions/${questionId}/`,
    containerId,
  })
}
