import type { _RenderingContext } from "../../types"
import type { EntryContentScore } from "../../../../types"
import { renderSmiley } from "../../inputs/scoreSmiley"
import { renderThumbDown, renderThumbUp } from "../../inputs/scoreThumbs"
import { renderStar } from "../../inputs/scoreStars"

export function _renderScore(_: _RenderingContext, entryContent: EntryContentScore) {
  const { value } = entryContent
  if (typeof value !== "number") return null

  switch (entryContent.scoreType) {
    case "smilies3":
    case "smilies5":
      return <div class="_q-scores _q-checked">{renderSmiley(value)}</div>
    case "nps":
      return <div class={`_q-scores _q-checked _q-npsc _q-s${value}`}>{(value / 10).toString()}</div>
    case "thumbs":
      return <div class="_q-scores _q-checked">{value == 100 ? renderThumbUp() : renderThumbDown()}</div>
    case "stars5":
      return (
        <div class="_q-scores _q-checked _q-stars">
          {Array.from({ length: value / 25 + 1 }, () => (
            <div class="_q-star-label _q-selected">{renderStar()}</div>
          ))}
        </div>
      )
    default:
      return null
  }
}
