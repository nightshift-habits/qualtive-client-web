import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentConfirmationText } from "../../../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderConfirmationText(
  context: _RenderingContext,
  enquiryContent: EnquirySubmittedContentConfirmationText,
) {
  return (
    <p class="_q-confirmation-text" style={_renderHorizontalPadding(context.padding)}>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <path
          d="M15 1L6.3738 9.62623C5.98325 10.0167 5.35008 10.0167 4.95956 9.62623L1 5.66663"
          stroke="#219653"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{enquiryContent.text}</span>
    </p>
  )
}
