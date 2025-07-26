import type { _RenderingContextSubmitted } from "../types"
import type { EnquirySubmittedContentUserInputScore } from "../../../types"
import { renderSmiley } from "../inputs/scoreSmiley"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _renderUserInputScore(context: _RenderingContextSubmitted, _: EnquirySubmittedContentUserInputScore) {
  return (
    <div class={`_q-user-input-score _q-checked _q-s${context.userInputScoreValue}`}>
      {renderSmiley(context.userInputScoreValue)}
    </div>
  )
}
