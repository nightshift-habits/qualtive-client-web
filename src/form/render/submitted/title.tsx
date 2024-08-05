import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentTitle } from "../../../types"

export function _renderTitle(_: _RenderingContext, enquiryContent: EnquirySubmittedContentTitle) {
  return <h3>{enquiryContent.text}</h3>
}
