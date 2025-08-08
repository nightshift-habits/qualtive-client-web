import type { EnquirySubmittedContent } from "../../../types"
import type { _RenderingContextSubmitted } from "../types"
import { _renderTitle } from "./title"
import { _renderBody } from "./body"
import { _renderImage } from "./image"
import { _renderConfirmationText } from "./confirmationText"
import { _renderName } from "./name"
import { _renderLink } from "./link"
import { _renderUserInputScore } from "./userInputScore"
import { _renderReviewLinks } from "./reviewLinks"

export function renderSubmittedPage(
  context: _RenderingContextSubmitted,
  content: EnquirySubmittedContent,
): Element | null | undefined {
  switch (content.type) {
    case "userInput":
      return null // Managed by the renderEnquiry using the same paging logic as input
    case "userInputScore":
      return _renderUserInputScore(context, content)
    case "name":
      return _renderName(context, content)
    case "title":
      return _renderTitle(context, content)
    case "body":
      return _renderBody(context, content)
    case "image":
      return _renderImage(context, content)
    case "confirmationText":
      return _renderConfirmationText(context, content)
    case "link":
      return _renderLink(context, content)
    case "reviewLinks":
      return _renderReviewLinks(context, content)
  }
}
