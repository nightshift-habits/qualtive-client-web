import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentTitle } from "../../../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderTitle(context: _RenderingContext, enquiryContent: EnquirySubmittedContentTitle) {
  return <h2 style={_renderHorizontalPadding(context.padding)}>{enquiryContent.text}</h2>
}
