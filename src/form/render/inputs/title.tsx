import type { EnquiryContentTitle, EntryContentTitle } from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderInputTitle(
  context: _RenderingContext,
  enquiryContent: EnquiryContentTitle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  content: EntryContentTitle,
) {
  return <h2 style={_renderHorizontalPadding(context.padding)}>{enquiryContent.text}</h2>
}
