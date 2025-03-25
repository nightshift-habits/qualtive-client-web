import type { EnquiryContentTitle, EntryContentTitle } from "../../../types"
import type { _RenderingContext } from "../types"

export function _renderInputTitle(
  context: _RenderingContext,
  enquiryContent: EnquiryContentTitle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  content: EntryContentTitle,
) {
  return (
    <h2 style={context.enquiry.theme.font.value === "heptaSlab" ? "font-family: var(--font-qh)" : undefined}>
      {enquiryContent.text}
    </h2>
  )
}
