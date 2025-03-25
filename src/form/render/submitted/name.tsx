import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentName } from "../../../types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _renderName(context: _RenderingContext, _: EnquirySubmittedContentName) {
  return (
    <h2 style={context.enquiry.theme.font.value === "heptaSlab" ? "font-family: var(--font-qh)" : undefined}>
      {context.enquiry.name}
    </h2>
  )
}
