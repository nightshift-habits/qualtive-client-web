import type { EnquiryContentBody } from "../../../types"
import type { _RenderingContext } from "../types"

export function _renderInputBody(context: _RenderingContext, enquiryContent: EnquiryContentBody) {
  return <p>{enquiryContent.text}</p>
}
