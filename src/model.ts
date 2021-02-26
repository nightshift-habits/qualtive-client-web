/**
 * Feedback entry contaning data for a user entry.
 */
export type Entry = {
  /**
   * Score value between 0 and 100. Required.
   */
  score: number

  /**
   * User typed text. Optional.
   */
  text?: string | null

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
