import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentName } from "../../../types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _renderName(context: _RenderingContext, _: EnquirySubmittedContentName) {
  return <h2>{context.enquiry.name}</h2>
}
