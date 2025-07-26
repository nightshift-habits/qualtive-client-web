import type { EnquiryContentImage } from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderInputImage(context: _RenderingContext, enquiryContent: EnquiryContentImage) {
  return <img src={enquiryContent.attachment.url} class="_q-image" style={_renderHorizontalPadding(context.padding)} />
}
