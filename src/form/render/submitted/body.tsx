import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentBody } from "../../../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderBody(context: _RenderingContext, enquiryContent: EnquirySubmittedContentBody) {
  return <p style={_renderHorizontalPadding(context.padding)}>{enquiryContent.text}</p>
}
