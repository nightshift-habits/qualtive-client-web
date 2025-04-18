import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentTitle } from "../../../types"

export function _renderTitle(_: _RenderingContext, enquiryContent: EnquirySubmittedContentTitle) {
  return <h2>{enquiryContent.text}</h2>
}
