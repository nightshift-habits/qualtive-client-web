import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentImage } from "../../../types"

export function _renderImage(_: _RenderingContext, enquiryContent: EnquirySubmittedContentImage) {
  const image = <img src={enquiryContent.attachment.url} class="_q-image" />

  if (enquiryContent.linkURL) {
    return (
      <a href={enquiryContent.linkURL} target="_blank" rel="noopener noreferrer">
        {image}
      </a>
    )
  }
  return image
}
