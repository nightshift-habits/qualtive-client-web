import type { EntryContent } from "../../../../types"
import type { _RenderingContext } from "../../types"
import { _renderTitle } from "./title"
import { _renderText } from "./text"
import { _renderScore } from "./score"
import { _renderAttachments } from "./attachments"
import { _renderSelect } from "./select"
import { _renderMultiselect } from "./multiselect"
import { _renderHorizontalPadding } from "../../utils"

export function renderSubmittedPageUserInput(
  context: _RenderingContext,
  content: (EntryContent | null)[],
  pageIndex: number,
  pageCount: number,
) {
  return (
    <div
      class={`_q-page ${pageIndex == pageCount - 1 ? "_q-current" : "_q-prev"}`}
      style={_renderHorizontalPadding(context.padding)}
    >
      <div class="_q-user-input">
        <div class={userInputClass(content)} />
        <div>
          {content.map((content) => {
            switch (content?.type) {
              case "title":
                return _renderTitle(context, content)
              case "text":
                return _renderText(context, content)
              case "score":
                return _renderScore(context, content)
              case "attachments":
                return _renderAttachments(context, content)
              case "select":
                return _renderSelect(context, content)
              case "multiselect":
                return _renderMultiselect(context, content)
            }
          })}
        </div>
      </div>
    </div>
  ) as HTMLDivElement
}

function userInputClass(content: (EntryContent | null)[]): string | undefined {
  const scores = content.map((x) => x && x.type == "score" && x.value).filter((x): x is number => typeof x === "number")
  if (scores.length === 0) return undefined
  const score = scores.reduce((a, b) => a + b, 0) / scores.length
  if (score >= 83) {
    return "_q-s100"
  }
  if (score >= 67) {
    return "_q-s75"
  }
  if (score >= 33) {
    return "_q-s50"
  }
  if (score >= 17) {
    return "_q-s25"
  }
  return "_q-s0"
}
