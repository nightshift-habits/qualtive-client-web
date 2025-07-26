import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentName } from "../../../types"
import { _renderHorizontalPadding } from "../utils"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _renderName(context: _RenderingContext, _: EnquirySubmittedContentName) {
  return <h1 style={_renderHorizontalPadding(context.padding)}>{context.enquiry.name}</h1>
}
