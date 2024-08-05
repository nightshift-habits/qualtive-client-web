import type { _RenderingContext } from "../types"
import type { EnquiryContentScore, EntryContentScore } from "../../../types"
import { _localized } from "../../../localized"
import { renderSmiley, type Score as SmileyScore } from "./scoreSmiley"

export function _renderInputScore(
  context: _RenderingContext,
  enquiryContent: EnquiryContentScore,
  entryContent: EntryContentScore,
) {
  const labels = renderLabels(enquiryContent)
  if (!labels) return null

  const scoresElement = (
    <div class={`_q-scores${enquiryContent.scoreType == "nps" ? " _q-nps" : ""}`}>
      {labels.map((x) => x.labelElement)}
    </div>
  )

  // Deselect if already checked
  labels.forEach(({ labelElement, radioElement }) => {
    let isMouseEvent = false
    let wasChecked = false
    labelElement.onmousedown = () => {
      isMouseEvent = true
      wasChecked = radioElement.checked
    }
    labelElement.onkeydown = (event) => {
      isMouseEvent = false
      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault()
          radioElement.checked = event.key == " " ? !radioElement.checked : true
          entryContent.value = radioElement.checked ? parseInt(radioElement.value) : null
          context.invalidateCanSend()
          break
      }
    }
    labelElement.onclick = () => {
      if (isMouseEvent && wasChecked) {
        setTimeout(() => {
          radioElement.checked = false
          entryContent.value = null
          context.invalidateCanSend()
        }, 5)
        return
      }
      entryContent.value = radioElement.checked ? parseInt(radioElement.value) : null
      context.invalidateCanSend()
    }
  })

  return enquiryContent.leadingText || enquiryContent.trailingText
    ? [
        <div class="_q-texts">
          <span>{enquiryContent.leadingText}</span>
          <span>{enquiryContent.trailingText}</span>
        </div>,
        scoresElement,
      ]
    : scoresElement
}

function renderLabels(
  enquiryContent: EnquiryContentScore,
): { labelElement: HTMLLabelElement; radioElement: HTMLInputElement }[] | null {
  const fieldName = Math.random().toString()
  switch (enquiryContent.scoreType) {
    case "smilies5":
    case "smilies3": {
      const scores: SmileyScore[] = enquiryContent.scoreType == "smilies3" ? [0, 50, 100] : [0, 25, 50, 75, 100]
      return scores.map((score) => {
        const radioElement = (<input type="radio" name={fieldName} value={score} />) as HTMLInputElement
        return {
          labelElement: (
            <label>
              {radioElement}
              {renderSmiley(score)}
            </label>
          ) as HTMLLabelElement,
          radioElement,
        }
      })
    }
    case "nps": {
      const scores: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      return scores.map((score) => {
        const radioElement = (<input type="radio" name={fieldName} value={score} />) as HTMLInputElement
        return {
          labelElement: (
            <label>
              {radioElement}
              <span class={`_q-s${score}`}>{(score / 10).toString()}</span>
            </label>
          ) as HTMLLabelElement,
          radioElement,
        }
      })
    }
    default:
      return null // Not implemented yet
  }
}
