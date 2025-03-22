import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentLink } from "../../../types"

export function _renderLink(_: _RenderingContext, enquiryContent: EnquirySubmittedContentLink) {
  return (
    <a href={enquiryContent.url} target="_blank" rel="noopener noreferrer" class="_q-contained">
      <span>{enquiryContent.text + " ->"}</span>
    </a>
  )
}
