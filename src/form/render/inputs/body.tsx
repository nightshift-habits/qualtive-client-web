import type { EnquiryContentBody } from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderInputBody(context: _RenderingContext, enquiryContent: EnquiryContentBody) {
  return <p style={_renderHorizontalPadding(context.padding)}>{enquiryContent.text}</p>
}
