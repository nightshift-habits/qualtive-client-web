import type { _RenderingContext } from "../types"
import type { EnquiryContentScore, EntryContentScore } from "../../../types"
import { renderSmiley } from "./scoreSmiley"
import { renderThumbDown, renderThumbUp } from "./scoreThumbs"
import { renderStar } from "./scoreStars"

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
  ) as HTMLDivElement

  // Interaction
  // - Deselect if already checked
  // - For stars, add hover and checked state for stars to leading side
  labels.forEach(({ labelElement, radioElement }) => {
    let isMouseEvent = false
    let wasChecked = false

    function didChangeValue() {
      if (enquiryContent.scoreType == "stars5") {
        labels!.forEach(({ labelElement }, otherStarIndex) => {
          if (entryContent.value !== null && otherStarIndex * 25 <= entryContent.value) {
            labelElement.classList.add("_q-selected")
          } else {
            labelElement.classList.remove("_q-selected")
          }
        })
      }
      context.invalidateCanSend()
    }

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
          didChangeValue()
          break
      }
    }
    labelElement.onclick = () => {
      if (isMouseEvent && wasChecked) {
        setTimeout(() => {
          radioElement.checked = false
          entryContent.value = null
          didChangeValue()
        }, 5)
        return
      }
      entryContent.value = radioElement.checked ? parseInt(radioElement.value) : null
      didChangeValue()
    }
  })

  if (enquiryContent.scoreType == "stars5") {
    scoresElement.onmousemove = (event) => {
      let hoverIndex =
        event.clientX > labels[labels.length - 1].labelElement.getBoundingClientRect().right
          ? -1
          : labels
              .map(({ labelElement }) => labelElement.getBoundingClientRect().left)
              .reverse()
              .findIndex((left) => event.clientX > left)

      if (hoverIndex == -1) {
        labels.forEach(({ labelElement }) => labelElement.classList.remove("_q-hover"))
      } else {
        hoverIndex = labels.length - hoverIndex - 1
        labels.forEach(({ labelElement }, otherStarIndex) => {
          if (otherStarIndex <= hoverIndex) {
            labelElement.classList.add("_q-hover")
          } else {
            labelElement.classList.remove("_q-hover")
          }
        })
      }
    }
    scoresElement.onmouseleave = () => {
      labels.forEach(({ labelElement }) => labelElement.classList.remove("_q-hover"))
    }
  }

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
  const scoreTypes = {
    smilies5: [0, 25, 50, 75, 100],
    smilies3: [0, 50, 100],
    nps: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    thumbs: [0, 100],
    stars5: [0, 25, 50, 75, 100],
  }

  const scores = scoreTypes[enquiryContent.scoreType]
  if (!scores) return null

  return scores.map((score) => {
    const radioElement = (<input type="radio" name={fieldName} value={score} />) as HTMLInputElement
    const labelContent = {
      smilies5: renderSmiley(score),
      smilies3: renderSmiley(score),
      nps: <span class={`_q-s${score}`}>{(score / 10).toString()}</span>,
      thumbs: score === 100 ? renderThumbUp() : renderThumbDown(),
      stars5: renderStar(),
    }[enquiryContent.scoreType]

    return {
      labelElement: (
        <label>
          {radioElement}
          {labelContent}
        </label>
      ) as HTMLLabelElement,
      radioElement,
    }
  })
}
