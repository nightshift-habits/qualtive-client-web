import { Question, _Options } from "./model"
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
