import { _localized } from "../../../localized"
import type { EnquirySubmittedContent } from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderTitle } from "./title"
import { _renderBody } from "./body"
import { _renderImage } from "./image"
import { _renderConfirmationText } from "./confirmationText"
import { _renderName } from "./name"

export function renderSubmittedPage(
  context: _RenderingContext,
  content: EnquirySubmittedContent,
): Element | null | undefined {
  switch (content.type) {
    case "userInput":
      return null // Managed by the renderEnquiry using the same paging logic as input
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
  }
}
