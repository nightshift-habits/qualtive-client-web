import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentImage } from "../../../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderImage(context: _RenderingContext, enquiryContent: EnquirySubmittedContentImage) {
  const image = <img src={enquiryContent.attachment.url} class="_q-image" />

  return (
    <div style={_renderHorizontalPadding(context.padding)}>
      {enquiryContent.linkURL ? (
        <a href={enquiryContent.linkURL} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  )
}
