/**
 * Feedback question representing a form or a question to present to the user.
 */
export type Question = {
  /**
   * Question identifier. Same as shown on qualtive.io.
   */
  id: string

  /**
   * Question name. Same as main title shown on qualtive.io.
   */
  name: string

  /**
   * Question content. The content and struction of the question to present til the user.
   */
  content: QuestionContent[]
}

/**
 * Question content types. Support question content types. Note that more types can be added in the future.
 */
export type QuestionContent = QuestionContentTitle | QuestionContentScore | QuestionContentText

/**
 * Title static type. This type does not require any user input and is only used as visual guide in the question.
 */
export type QuestionContentTitle = {
  type: "title"

  /**
   * Text to show in the title.
   */
  text: string
}

/**
 * Score input type. This type allows the user to enter a score (rating) between 0 and 100.
 */
export type QuestionContentScore = {
  type: "score"
}

/**
 * Text input type. This type allows the user to enter a free-form text.
 */
export type QuestionContentText = {
  type: "text"
  placeholder: string | null
}

/**
 * Feedback entry contaning data for a user entry.
 */
export type Entry = {
  /**
   * Score value between 0 and 100. Optional.
   *
   * Note that this property is ignored if the content-property is set.
   */
  score?: number | null

  /**
   * User typed text. Optional.
   *
   * Note that this property is ignored if the content-property is set.
   */
  text?: string | null

  /**
   * Entry content.
   *
   * If this property is set it overrides any possible value in the score and text-properties.
   */
  content?: EntryContent[]

  /**
   * User who entered feedback. For example the logged in user on the site. Optional.
   */
  user?: {
    id?: string | number | null
    name?: string
    email?: string
  } | null

  /**
   * Custom attributes
   */
  customAttributes?: { [key: string]: string | number | boolean | null } | null
}

/**
 * Section of content for a entry. Determined by the content of a Question.
 *
 * Only difference between the content of a Entry and a Question is that EntryContent accepts input while QuestionContent is only for display.
 */
export type EntryContent = EntryContentTitle | EntryContentScore | EntryContentText

/**
 * Title static type. This type does not require any user input and is only used as visual guide in the question. Does not have any input.
 *
 * QuestionContentTitle is co-responding question content.
 */
export type EntryContentTitle = {
  type: "title"

  /**
   * Text that has been shown in the title.
   */
  text: string
}

/**
 * Score input type. This type allows the user to enter a score (rating) between 0 and 100.
 *
 * QuestionContentScore is co-responding question content.
 */
export type EntryContentScore = {
  type: "score"

  /**
   * User selected score (rating) between 0 and 100.
   */
  value: number | null
}

/**
 * Text input type. This type allows the user to enter a free-form text.
 *
 * QuestionContentText is co-responding question content.
 */
export type EntryContentText = {
  type: "text"

  /**
   * User selected text.
   */
  value: string | null
}

/**
 * Reference to a posted entry.
 */
export type EntryReference = {
  /**
   * Identifier for the posted entry.
   *
   * Posted entries can be viewed in admin following this pattern: https://qualtive.app/{container-id}/{entry-id}/
   */
  id: number
}

/**
 * Optional base options to use when posting feedback.
 */
export type _Options = {
  /**
   * The remote url to post feedback to. Must include scheme and host. For debug usages only.
   */
  _remoteUrl?: string | null
}
