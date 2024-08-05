import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentBody } from "../../../types"

export function _renderBody(_: _RenderingContext, enquiryContent: EnquirySubmittedContentBody) {
  return <p>{enquiryContent.text}</p>
}
