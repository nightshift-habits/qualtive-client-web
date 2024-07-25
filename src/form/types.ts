import { EntryContent, EntryReference } from "../types"
import { type GetEnquiryOptions } from "../getEnquiry"
import { type PostOptions } from "../post"

/**
 * Optional options to use when posting feedback using built in form-UI.
 */
export type FormOptions = GetEnquiryOptions &
  PostOptions & {
    /**
     * Localized form title to show on top of the form. Default is `"Leave feedback"`.
     */
    title?: string

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
     * Optional link to customer support. If this property has a value a link the custom support will be displayed in the form. Default is `null`.
     */
    supportURL?: string

    /**
     * Option to override if dark appearance should be used or not. Default is auto.
     *
     * - auto: Dark mode is used if the user prefers dark mode.
     * - never: Dark mode will never be used.
     * - always: Dark mode will always be used.
     */
    darkMode?: "auto" | "never" | "always"

    /**
     * Option to set size of form. Default is compact.
     *
     * - compact: Compact width. Preferred to be used in short forms.
     * - wide: Wider width. Preferred to be used in longer forms.
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

export type _InputRenderingContext = {
  containerId: string
  containerElement: HTMLElement
  noClickElement: HTMLElement
  contentElement: HTMLElement
  tabIndex: number
  options: FormOptions | undefined
  invalidateCanSend: () => void
}

export type _PreviewRenderingContext = {
  currentResultElement: HTMLElement
  options: FormOptions | undefined
}
