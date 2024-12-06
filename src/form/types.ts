import type { Entry, EntryContent, EntryReference, User } from "../types"
import { type GetEnquiryOptions } from "../getEnquiry"
import { type PostOptions } from "../post"

export type RenderEnquiryOptions = GetEnquiryOptions &
  PostOptions & {
    /**
     * User who entered feedback. For example the logged in user on the site. Optional.
     */
    user?: User | null

    /**
     * Custom attributes
     */
    customAttributes?: Entry["customAttributes"]

    /**
     * Option to override if dark appearance should be used or not. Default is auto.
     *
     * - auto: Dark mode is used if the user prefers dark mode.
     * - never: Dark mode will never be used.
     * - always: Dark mode will always be used.
     */
    darkMode?: "auto" | "never" | "always"

    /**
     * Optional function that is called when the form was submitted. First parameter contains the reference sent entry.
     */
    onSubmitted?: (entry: EntryReference & PostedEntry) => void

    _containerElement?: HTMLElement
    _noClickElement?: HTMLElement
    _skipStyles?: boolean
  }

/**
 * Optional options to use when posting feedback using built in form-UI.
 */
export type FormOptions = RenderEnquiryOptions & {
  /**
   * Localized form title to show on top of the form. Default is `"Leave feedback"`.
   * @deprecated No longer used.
   */
  title?: string

  /**
   * Optional link to customer support. If this property has a value a link the custom support will be displayed in the form. Default is `null`.
   */
  supportURL?: string

  /**
   * Option to set size of form. Default is compact.
   *
   * - compact: Compact width. Preferred to be used in short forms.
   * - wide: Wider width. Preferred to be used in longer forms.
   *
   * @deprecated No longer used.
   */
  size?: "compact" | "wide"

  /**
   * Option to disallow dismissal of the form by clicking escape on the keyboard. Default is false.
   */
  disallowKeyboardDismiss?: boolean

  /**
   * Optional function that is called when the form is dismissed. First parameter contains the reference sent entry or null if the form was cancelled.
   */
  onDismiss?: (entry: (EntryReference & PostedEntry) | null) => void
}

/**
 * Reference to a presented form.
 */
export type Form = {
  /**
   * Dismisses the form.
   */
  dismiss: () => void
}

/**
 * Result of a posted entry.
 */
export type PostedEntry = {
  /**
   * Identifier for the posted entry.
   *
   * Posted entries can be viewed in admin following this pattern: https://qualtive.app/{container-id}/{entry-id}/
   */
  id: number

  /**
   * Entry content.
   */
  content: EntryContent[]
}
