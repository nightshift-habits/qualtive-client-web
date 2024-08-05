import type { EnquiryContentTitle, EntryContentTitle } from "../../../types"
import type { _RenderingContext } from "../types"

export function _renderInputTitle(_: _RenderingContext, enquiryContent: EnquiryContentTitle, __: EntryContentTitle) {
  return <h2>{enquiryContent.text}</h2>
}
