import { _InputRenderingContext } from "./model"
import { _localized } from "../localized"
import { EntryContentScore, QuestionContentScore } from "../model"
import { _constants } from "./constants"

export const _renderInputScore = (
  context: _InputRenderingContext,
  questionContent: QuestionContentScore,
  entryContent: EntryContentScore
): void => {
  const scoresElement = document.createElement("ul")

  const optionButtonElements: HTMLButtonElement[] = []
  let optionElements: HTMLLIElement[]
  let scores: number[]

  switch (questionContent.scoreType) {
    case "smilies5":
    case "smilies3":
      scoresElement.setAttribute("class", "_q-score _q-smilies")

      scores = questionContent.scoreType == "smilies5" ? _constants.scoresSmilies5 : _constants.scoresSmilies3
      optionElements = scores.map((score) => {
        if (score != 0) {
          const spaceElement = document.createElement("li")
          spaceElement.innerHTML = "&nbsp;"
          scoresElement.appendChild(spaceElement)
        }

        const optionElement = document.createElement("li")
        optionElement.setAttribute("class", `_q-option _q-${score}`)
        scoresElement.appendChild(optionElement)

        const buttonElement = document.createElement("button")
        buttonElement.setAttribute("tabindex", context.tabIndex.toString())
        buttonElement.setAttribute("title", _localized(`form.score.${score}`, context.options?.locale))
        optionButtonElements.push(buttonElement)
        optionElement.appendChild(buttonElement)
        context.tabIndex++

        switch (score) {
          case 0:
            buttonElement.innerHTML = _constants.iconScore0 + _constants.iconScore0Filled
            break
          case 25:
            buttonElement.innerHTML = _constants.iconScore25 + _constants.iconScore25Filled
            break
          case 50:
            buttonElement.innerHTML = _constants.iconScore50 + _constants.iconScore50Filled
            break
          case 75:
            buttonElement.innerHTML = _constants.iconScore75 + _constants.iconScore75Filled
            break
          case 100:
            buttonElement.innerHTML = _constants.iconScore100 + _constants.iconScore100Filled
            break
        }

        return optionElement
      })
      break
    case "nps": {
      scoresElement.setAttribute("class", "_q-score _q-nps")

      const textContainerElement = document.createElement("div")
      textContainerElement.setAttribute("class", "_q-leading-trailing")
      context.contentElement.appendChild(textContainerElement)

      const trailingTextElement = document.createElement("span")
      trailingTextElement.innerText =
        questionContent.trailingText || _localized(`form.nps.trailing`, context.options?.locale)
      textContainerElement.appendChild(trailingTextElement)

      const leadingTextElement = document.createElement("span")
      leadingTextElement.innerText =
        questionContent.leadingText || _localized(`form.nps.leading`, context.options?.locale)
      textContainerElement.appendChild(leadingTextElement)

      scores = _constants.scoresNPS
      optionElements = scores.map((score) => {
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

        const optionElement = document.createElement("li")
        optionElement.setAttribute("class", `_q-option _q-l${level}`)
        scoresElement.appendChild(optionElement)

        const buttonElement = document.createElement("button")
        buttonElement.setAttribute("tabindex", context.tabIndex.toString())
        buttonElement.innerHTML = score / 10 + ""
        optionButtonElements.push(buttonElement)
        optionElement.appendChild(buttonElement)
        context.tabIndex++

        return optionElement
      })
      break
    }
    default:
      return // Not implemented yet
  }

  context.contentElement.appendChild(scoresElement)

  optionButtonElements.forEach((buttonElement, index) => {
    buttonElement.onclick = () => {
      optionElements.forEach((x) => (x.className = x.className.replace(" _q-selected", "")))

      if (entryContent.value != scores[index]) {
        optionElements[index].className += " _q-selected"
        entryContent.value = scores[index]
      } else {
        entryContent.value = null
      }
      context.invalidateCanSend()
    }
  })
}
