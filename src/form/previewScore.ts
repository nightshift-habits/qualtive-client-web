import { _PreviewRenderingContext } from "./model"
import { _localized } from "../localized"
import { EntryContentScore } from "../model"
import { _constants } from "./constants"

export const _renderPreviewScore = (context: _PreviewRenderingContext, content: EntryContentScore): void => {
  switch (content.scoreType) {
    case "smilies3":
    case "smilies5": {
      const scoreElement = document.createElement("div")
      scoreElement.className = "_q-scored"
      switch (content.value) {
        case 0:
          scoreElement.innerHTML = _constants.iconScore0Filled
          break
        case 25:
          scoreElement.innerHTML = _constants.iconScore25Filled
          break
        case 50:
          scoreElement.innerHTML = _constants.iconScore50Filled
          break
        case 75:
          scoreElement.innerHTML = _constants.iconScore75Filled
          break
        case 100:
          scoreElement.innerHTML = _constants.iconScore100Filled
          break
      }
      context.currentResultElement.appendChild(scoreElement)
      break
    }
    case "nps": {
      const textContainerElement = document.createElement("div")
      textContainerElement.setAttribute("class", "_q-leading-trailing")
      context.currentResultElement.appendChild(textContainerElement)

      const trailingTextElement = document.createElement("span")
      trailingTextElement.innerText = content.trailingText || _localized(`form.nps.trailing`, context.options?.locale)
      textContainerElement.appendChild(trailingTextElement)

      const leadingTextElement = document.createElement("span")
      leadingTextElement.innerText = content.leadingText || _localized(`form.nps.leading`, context.options?.locale)
      textContainerElement.appendChild(leadingTextElement)

      const scoresElement = document.createElement("ul")
      scoresElement.setAttribute("class", "_q-score _q-nps")
      _constants.scoresNPS.forEach((score) => {
        if (score != 0) {
          const spaceElement = document.createElement("li")
          spaceElement.innerHTML = "&nbsp;"
          scoresElement.appendChild(spaceElement)
        }

        let level: number
        if (score <= 20) {
          level = 0
        } else if (score <= 60) {
          level = 1
        } else if (score <= 80) {
          level = 2
        } else {
          level = 3
        }

        const liElement = document.createElement("li")
        liElement.setAttribute("class", `_q-l${level}${content.value == score ? " _q-selected" : ""}`)
        scoresElement.appendChild(liElement)

        const spanElement = document.createElement("span")
        spanElement.innerHTML = score / 10 + ""
        liElement.appendChild(spanElement)
      })
      context.currentResultElement.appendChild(scoresElement)
      break
    }
  }
}
