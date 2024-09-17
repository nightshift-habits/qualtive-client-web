import type { EnquiryContentImage } from "../../../types"
import type { _RenderingContext } from "../types"

export function _renderInputImage(context: _RenderingContext, enquiryContent: EnquiryContentImage) {
  return <img src={enquiryContent.attachment.url} class="_q-image" />
}
