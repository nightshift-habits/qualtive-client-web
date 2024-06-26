/**
 * Kind/type of score to display for a user.
 */
export type ScoreType = "smilies5" | "smilies3" | "thumbs" | "nps"

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
   * Question content. The content and structure of the question to present til the user.
   */
  content: QuestionContent[]

  /**
   * Details about the container the question belongs to.
   */
  container: QuestionContainer
}

export type QuestionContainer = {
  /**
   * `true` if the container is allowed to hide the Qualtive-branding, else, `false` meaning Qualtive branding must be shown.
   */
  isWhiteLabel: boolean
}

/**
 * Question content types. Support question content types. Note that more types can be added in the future.
 */
export type QuestionContent =
  | QuestionContentTitle
  | QuestionContentScore
  | QuestionContentText
  | QuestionContentSelect
  | QuestionContentMultiselect
  | QuestionContentAttachments

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
  scoreType: ScoreType
  leadingText: string | null
  trailingText: string | null
}

/**
 * Text input type. This type allows the user to enter a free-form text.
 */
export type QuestionContentText = {
  type: "text"
  placeholder: string | null
}

/**
 * Single select/radio input type. This type allows the user to enter one of predefined options.
 */
export type QuestionContentSelect = {
  type: "select"
  options: string[]
  allowsCustomInput: boolean
}

/**
 * Multi select/checkbox input type. This type allows the user to enter zero or more of predefined options.
 */
export type QuestionContentMultiselect = {
  type: "multiselect"
  options: string[]
}

/**
 * Attachments input type. This type allows the user to add attachments like images.
 */
export type QuestionContentAttachments = {
  type: "attachments"
}

/**
 * Feedback entry containing data for a user entry.
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

  /**
   * Source of where the entry was created from. Optional.
   */
  source?: {
    webpageUrl?: string | null
  }
}

/**
 * Section of content for an entry. Determined by the content of a Question.
 *
 * Only difference between the content of an Entry and a Question is that EntryContent accepts input while QuestionContent is only for display.
 */
export type EntryContent =
  | EntryContentTitle
  | EntryContentScore
  | EntryContentText
  | EntryContentSelect
  | EntryContentMultiselect
  | EntryContentAttachments

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
  scoreType: ScoreType
  leadingText: string | null
  trailingText: string | null

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
 * Single select/radio input type. This type allows the user to enter one of predefined options.
 *
 * QuestionContentSelect is co-responding question content.
 */
export type EntryContentSelect = {
  type: "select"

  /**
   * User selected option.
   */
  value: string | null
}

/**
 * Multi select/checkbox input type. This type allows the user to enter zero or more of predefined options.
 *
 * QuestionContentMultiselect is co-responding question content.
 */
export type EntryContentMultiselect = {
  type: "multiselect"

  /**
   * User selected options.
   */
  values: string[]
}

/**
 * Attachments input type. This type allows the user to add attachments like images.
 *
 * QuestionContentAttachments is co-responding question content.
 */
export type EntryContentAttachments = {
  type: "attachments"

  /**
   * User selected attachments.
   */
  values: Attachment[]
}

/**
 * User uploadable attachment reference.
 */
export type Attachment = {
  id: number
}

/**
 * A valid content type/mime type for an attachment.
 */
export type AttachmentContentType = "image/png" | "image/jpeg"

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
   * The locale to use. Defaults to `navigator?.language || en-us`.
   */
  locale?: string
  /**
   * Method to use for networking.
   *
   * Possible values:
   * - "auto", undefined, null: The package will automatically choose the preferred method of doing networking.
   * - "fetch": The Fetch API will be used: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * - "xmlhttprequest": The XMLHttpRequest API will be used: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
   * - a function: Allows you to handle request yourself. See RequestCaller-type for variables and expected result.
   */
  networking?: "auto" | "fetch" | "xmlhttprequest" | RequestCaller | null
  /**
   * The remote url to post feedback too. Must include scheme and host. For debug usages only.
   */
  _remoteUrl?: string | null
}

/**
 * Interface for handling custom networking. See _Options.
 */
export type RequestCaller = <T>(
  method: string,
  url: string,
  headers: { [key: string]: string },
  body: unknown | undefined,
) => Promise<T>
