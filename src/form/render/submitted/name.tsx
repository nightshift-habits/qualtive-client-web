import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentName } from "../../../types"

export function _renderName(context: _RenderingContext, _: EnquirySubmittedContentName) {
  return <h2>{context.enquiry.name}</h2>
}
