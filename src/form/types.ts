import type { _Options, Entry, EntryContent, EntryContentPage, EntryReference, User } from "../types"
import { type PostOptions } from "../post"
import { type GetEnquiryOptions } from "../getEnquiry"

export type RenderEnquiryOptions = _Options &
  PostOptions &
  RenderEnquirySubmittedOptions & {
    /**
     * User who entered feedback. For example the logged in user on the site. Optional.
     */
    user?: User | null

    /**
     * Custom attributes
     */
    customAttributes?: Entry["customAttributes"]

    /**
     * Optional function that is called when the form was submitted. First parameter contains the reference sent entry.
     *
     * This function can return a promise to indicate that the form is still processing.
     *
     * Note: Throwing in this function will be logged to console and not shown to the end user.
     */
    onSubmitted?: (entry: EntryReference & PostedEntry) => Promise<void> | void
  }

export type RenderEnquirySubmittedOptions = _Options & {
  /**
   * Option to override if dark appearance should be used or not. Default is auto.
   *
   * - auto: Dark mode is used if the user prefers dark mode.
   * - never: Dark mode will never be used.
   * - always: Dark mode will always be used.
   */
  darkMode?: "auto" | "never" | "always"

  /**
   * Option to add padding to the form. Defaults to `0`.
   */
  padding?: PaddingValue

  _containerElement?: HTMLElement
  _noClickElement?: HTMLElement
  _skipStyles?: boolean
}

export type PaddingValueUnit = `var(--${string})` | `${number}px` | `${number}rem` | `${number}em` | "0"
export type PaddingValue =
  | PaddingValueUnit
  | `${PaddingValueUnit} ${PaddingValueUnit}`
  | `${PaddingValueUnit} ${PaddingValueUnit} ${PaddingValueUnit}`
  | `${PaddingValueUnit} ${PaddingValueUnit} ${PaddingValueUnit} ${PaddingValueUnit}`

/**
 * Optional options to use when posting feedback using built in form-UI.
 */
export type FormOptions = RenderEnquiryOptions &
  GetEnquiryOptions & {
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

  /**
   * Pages of content.
   */
  pages: EntryContentPage[]
}
