import type { _RenderingContext } from "../../types"
import type { EntryContentScore } from "../../../../types"
import { type Score, renderSmiley } from "../../inputs/scoreSmiley"

export function _renderScore(_: _RenderingContext, entryContent: EntryContentScore) {
  if (typeof entryContent.value !== "number") return null

  switch (entryContent.scoreType) {
    case "smilies3":
    case "smilies5":
      return <div class="_q-scores _q-checked">{renderSmiley(entryContent.value as Score)}</div>
    case "nps":
      return (
        <div class={`_q-scores _q-checked _q-npsc _q-s${entryContent.value}`}>
          {(entryContent.value / 10).toString()}
        </div>
      )
    default:
      return null
  }
}
