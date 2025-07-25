/**
 * Helper type for taking a value which can be reolved by a function and/or a promise.
 */
export type Resolvable<T> = T | Promise<T> | (() => T) | (() => Promise<T>)

/**
 * Reference to a enquiry in a container.
 */
export type Collection = string | [string, string | number]

/**
 * Kind/type of score to display for a user.
 */
export type ScoreType = "smilies5" | "smilies3" | "thumbs" | "nps" | "stars5"

/**
 * Feedback question representing a form or a question to present to the user.
 * @deprecated Use Enquiry instead.
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

/**
 * @deprecated Use EnquiryContent instead.
 */
export type QuestionContent = EnquiryContent

/**
 * @deprecated Use EnquiryContainer instead.
 */
export type QuestionContainer = EnquiryContainer

/**
 * @deprecated Use EnquiryContentTitle instead.
 */
export type QuestionContentTitle = EnquiryContentTitle
/**
 * @deprecated Use EnquiryContentScore instead.
 */
export type QuestionContentScore = EnquiryContentScore
/**
 * @deprecated Use EnquiryContentText instead.
 */
export type QuestionContentText = EnquiryContentText
/**
 * @deprecated Use EnquiryContentSelect instead.
 */
export type QuestionContentSelect = EnquiryContentSelect
/**
 * @deprecated Use EnquiryContentMultiselect instead.
 */
export type QuestionContentMultiselect = EnquiryContentMultiselect
/**
 * @deprecated Use EnquiryContentAttachments instead.
 */
export type QuestionContentAttachments = EnquiryContentAttachments

/**
 * Feedback enquiry representing a form or a question to present to the user.
 */
export type Enquiry = {
  /**
   * Enquiry identifier.
   */
  id: number

  /**
   * Enquiry slug. Same as shown on qualtive.io.
   */
  slug: string

  /**
   * Enquiry name. Same as main title shown on qualtive.io.
   */
  name: string

  /**
   * Enquiry pages. The content and structure of the enquiry to present to the user.
   */
  pages: EnquiryPage[]

  /**
   * @deprecated Use submittedPages instead.
   */
  submittedPage: LegacyEnquirySubmittedPage

  /**
   * Enquiry submitted pages. The content and structure of the enquiry to present to the user once submitted.
   */
  submittedPages: EnquirySubmittedPage[]

  /**
   * Theme of the enquiry. Controls the appearance properties of the enquiry.
   */
  theme: EnquiryTheme

  /**
   * Details about the container the enquiry belongs to.
   */
  container: EnquiryContainer
}

/**
 * Theme configuration for an enquiry. Controls the visual appearance of the enquiry form.
 */
export type EnquiryTheme = {
  /**
   * Background configuration for the enquiry form. This has no effect when using the sheet or inline presentation.
   */
  background: EnquiryThemeBackground

  /**
   * Font configuration for the enquiry form. Only affects the title of the enquiry.
   */
  font: EnquiryThemeFont

  /**
   * Controls the corner style of UI elements in the form.
   * - "rounded": Elements have rounded corners
   * - "square": Elements have sharp corners
   */
  cornerStyle: "rounded" | "square"
}

/**
 * Background configuration for an enquiry theme. Can be either predefined or custom.
 */
export type EnquiryThemeBackground = EnquiryThemeBackgroundPredefined | EnquiryThemeBackgroundCustom

/**
 * Predefined background configuration using built-in background styles.
 */
export type EnquiryThemeBackgroundPredefined = {
  /**
   * Indicates this is a predefined background configuration.
   */
  type: "predefined"

  /**
   * The predefined background style to use.
   * - "plain": Simple solid background
   * - "sponda": Sponda-style background pattern with a gradient
   */
  value: "plain" | "sponda"
}

/**
 * Custom background configuration allowing custom colors and image attachments.
 */
export type EnquiryThemeBackgroundCustom = {
  /**
   * Indicates this is a custom background configuration.
   */
  type: "custom"

  /**
   * Optional background image attachment. If null, only the background color will be used.
   */
  attachment: {
    /**
     * MIME type of the background image (e.g. "image/jpeg", "image/png").
     */
    contentType: string

    /**
     * URL to the background image resource.
     */
    url: string
  } | null

  /**
   * Background color configuration.
   */
  color: {
    /**
     * CSS color value (e.g. "#FF0000").
     */
    value: string
  }
}

/**
 * Font configuration for an enquiry theme. Supports both predefined and custom fonts.
 */
export type EnquiryThemeFont = EnquiryThemeFontPredefined | EnquiryThemeFontCustom

/**
 * Predefined font configuration using built-in font families.
 */
export type EnquiryThemeFontPredefined = {
  /**
   * Indicates this is a predefined font configuration.
   */
  type: "predefined"

  /**
   * The font family to use.
   * - "default": System default font stack
   * - "heptaSlab": Hepta Slab font family
   * - Or any other supported font family string
   */
  value: "default" | "heptaSlab" | string
}

/**
 * Custom font configuration using a custom font family.
 */
export type EnquiryThemeFontCustom = {
  /**
   * Indicates this is a custom font configuration.
   */
  type: "custom"

  /**
   * Remote URL to the custom font family.
   */
  url: string
}

export type EnquiryContainer = {
  /**
   * Identifier of the container.
   */
  id: string

  /**
   * `true` if the container is allowed to hide the Qualtive-branding, else, `false` meaning Qualtive branding must be shown.
   */
  isWhiteLabel: boolean

  /**
   * Logo of the container. Null if no logo has been set.
   */
  logo: {
    urlVector: string
    urlVectorDark: string
  } | null

  /**
   * Visibility mode of the container. If `public`, the responses are publicly visible for other users. If `private`, the responses are only visible to the workspace users.
   */
  visibilityMode: "public" | "private"
}

export type EnquiryPage = {
  /**
   * Page content. The content and structure of the enquiry to present to the user.
   */
  content: EnquiryContent[]
}

export type EnquirySubmittedPage = {
  /**
   * Page content. The content and structure of the enquiry to present to the user once submitted.
   */
  content: EnquirySubmittedContent[]

  /**
   * Conditions that determine when a submitted page should be shown.
   */
  conditions: EnquirySubmittedPageCondition[]
}

/**
 * @deprecated Use EnquirySubmittedPage instead.
 */
export type LegacyEnquirySubmittedPage = {
  /**
   * Page content. The content and structure of the enquiry to present to the user once submitted.
   */
  content: EnquirySubmittedContent[]
}

export type EnquirySubmittedPageCondition = EnquirySubmittedPageConditionScore

export type EnquirySubmittedPageConditionScore = {
  type: "score"
  ranges: EnquirySubmittedPageConditionScoreRange[]
}

export type EnquirySubmittedPageConditionScoreRange = {
  lower: number | null
  upper: number | null
}

/**
 * Enquiry content types. Note that more types can be added in the future.
 */
export type EnquiryContent =
  | EnquiryContentTitle
  | EnquiryContentBody
  | EnquiryContentImage
  | EnquiryContentScore
  | EnquiryContentText
  | EnquiryContentSelect
  | EnquiryContentMultiselect
  | EnquiryContentAttachments
  | EnquiryContentContactDetails

/**
 * Title static type. This type does not require any user input and is only used as visual guide in the enquiry.
 */
export type EnquiryContentTitle = {
  type: "title"

  /**
   * Text to show in the title.
   */
  text: string
}

/**
 * Body static type. This type does not require any user input and is only used as visual guide in the enquiry.
 */
export type EnquiryContentBody = {
  type: "body"

  /**
   * Text to show in the body.
   */
  text: string
}

/**
 * Static image section with an attachment.
 */
export type EnquiryContentImage = {
  type: "image"

  /**
   * Attachment to show in the component.
   */
  attachment: {
    /**
     * Remote URL to the attachment show in the component.
     */
    url: string
  }
}

/**
 * Score input type. This type allows the user to enter a score (rating) between 0 and 100.
 */
export type EnquiryContentScore = {
  type: "score"
  scoreType: ScoreType
  leadingText: string | null
  trailingText: string | null
}

/**
 * Text input type. This type allows the user to enter a free-form text.
 */
export type EnquiryContentText = {
  type: "text"
  placeholder: string | null
}

/**
 * Single select/radio input type. This type allows the user to enter one of predefined options.
 */
export type EnquiryContentSelect = {
  type: "select"
  options: string[]
  allowsCustomInput: boolean
}

/**
 * Multi select/checkbox input type. This type allows the user to enter zero or more of predefined options.
 */
export type EnquiryContentMultiselect = {
  type: "multiselect"
  options: string[]
}

/**
 * Attachments input type. This type allows the user to add attachments like images.
 */
export type EnquiryContentAttachments = {
  type: "attachments"
}

/**
 * Component for allowing entering their contact details if not given automatically.
 */
export type EnquiryContentContactDetails = {
  type: "contactDetails"
  title: string
  placeholder: string
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
  user?: Resolvable<User | null | undefined>

  /**
   * Custom attributes for an entry. Optional.
   */
  customAttributes?: Resolvable<CustomAttributes | null | undefined>

  /**
   * Source of where the entry was created from. Optional.
   */
  source?: {
    webpageUrl?: string | null
  }
}

/**
 * User who entered feedback. For example the logged in user on the site.
 */
export type User = {
  id?: string | number | null
  name?: string
  email?: string
}

/**
 * Custom attributes for an entry.
 */
export type CustomAttributes = { [key: string]: string | number | boolean | null | undefined }

/**
 * Enquiry content types. Note that more types can be added in the future.
 */
export type EnquirySubmittedContent =
  | EnquirySubmittedContentName
  | EnquirySubmittedContentConfirmationText
  | EnquirySubmittedContentUserInput
  | EnquirySubmittedContentTitle
  | EnquirySubmittedContentBody
  | EnquirySubmittedContentImage
  | EnquirySubmittedContentLink

/**
 * Section showing the name of the enquiry.
 */
export type EnquirySubmittedContentName = {
  type: "name"
}

/**
 * Static confirmation text section with text.
 */
export type EnquirySubmittedContentConfirmationText = {
  type: "confirmationText"

  /**
   * Text to show in the component.
   */
  text: string
}

/**
 * Section showing the name of the enquiry.
 */
export type EnquirySubmittedContentUserInput = {
  type: "userInput"
}

/**
 * Static title section.
 */
export type EnquirySubmittedContentTitle = {
  type: "title"

  /**
   * Text to show in the component.
   */
  text: string
}

/**
 * Static body section with text.
 */
export type EnquirySubmittedContentBody = {
  type: "body"

  /**
   * Text to show in the component.
   */
  text: string
}

/**
 * Static image section with an attachment.
 */
export type EnquirySubmittedContentImage = {
  type: "image"

  /**
   * Attachment to show in the component.
   */
  attachment: {
    /**
     * Remote URL to the attachment show in the component.
     */
    url: string
  }

  /**
   * Optional URL that the image links to. If provided, the image will be wrapped in a link. The link will open in a new tab.
   */
  linkURL: string | null
}

/**
 * Link button that opens a URL when a button is tapped/clicked.
 */
export type EnquirySubmittedContentLink = {
  type: "link"

  /**
   * Text to display on the button.
   */
  text: string

  /**
   * URL to open in a new tab when clicked.
   */
  url: string
}

/**
 * Page of content for an entry.
 */
export type EntryContentPage = {
  content: EntryContent[]
}

/**
 * Section of content for an entry. Determined by the content of a Enquiry.
 *
 * Only difference between the content of an Entry and a Enquiry is that EntryContent accepts input while EnquiryContent is only for display.
 */
export type EntryContent =
  | EntryContentTitle
  | EntryContentScore
  | EntryContentText
  | EntryContentSelect
  | EntryContentMultiselect
  | EntryContentAttachments

/**
 * Title static type. This type does not require any user input and is only used as visual guide in the enquiry. Does not have any input.
 *
 * EnquiryContentTitle is co-responding enquiry content.
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
 * EnquiryContentScore is co-responding enquiry content.
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
 * EnquiryContentText is co-responding enquiry content.
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
 * EnquiryContentSelect is co-responding enquiry content.
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
 * EnquiryContentMultiselect is co-responding enquiry content.
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
 * EnquiryContentAttachments is co-responding enquiry content.
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
   * The remote url to post feedback too. Must include scheme and host. For testing and internal usages only.
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
