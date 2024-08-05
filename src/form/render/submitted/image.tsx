import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentImage } from "../../../types"

export function _renderImage(_: _RenderingContext, enquiryContent: EnquirySubmittedContentImage) {
  return <img src={enquiryContent.attachment.url} class="_q-image" />
}
