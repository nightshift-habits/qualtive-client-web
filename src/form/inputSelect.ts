import { _InputRenderingContext } from "./model"
import { EntryContentSelect, QuestionContentSelect } from "../model"
import { _constants } from "./constants"
import { _localized } from "../localized"

export const _renderInputSelect = (
  context: _InputRenderingContext,
  questionContent: QuestionContentSelect,
  entryContent: EntryContentSelect
): void => {
  const selectContainerElement = document.createElement("div")
  selectContainerElement.className = "_q-options _q-select"
  context.contentElement.appendChild(selectContainerElement)

  if (questionContent.options.length >= 5) {
    // Select
    const selectElement = document.createElement("select")
    selectElement.setAttribute("tabindex", context.tabIndex.toString())
    selectContainerElement.appendChild(selectElement)
    context.tabIndex++

    // Placeholder option
    const placeholderOptionElement = document.createElement("option")
    placeholderOptionElement.innerHTML = _localized("form.choose", context.options?.locale)
    placeholderOptionElement.value = ""
    placeholderOptionElement.selected = true
    selectElement.appendChild(placeholderOptionElement)

    const dividerOptionElement = document.createElement("option")
    dividerOptionElement.innerHTML = "–"
    dividerOptionElement.value = ""
    dividerOptionElement.disabled = true
    selectElement.appendChild(dividerOptionElement)

    // All options
    questionContent.options.forEach((option) => {
      const optionElement = document.createElement("option")
      optionElement.innerHTML = option
      optionElement.value = option
      selectElement.appendChild(optionElement)
    })

    // Interaction
    selectElement.onchange = () => {
      if (placeholderOptionElement.selected) {
        entryContent.value = null
      } else {
        entryContent.value = selectElement.value
      }

      context.invalidateCanSend()
    }
  } else {
    // Rows
    const rows: [HTMLButtonElement, HTMLSpanElement][] = []
    questionContent.options.forEach((option) => {
      // Button
      const buttonElement = document.createElement("button")
      buttonElement.setAttribute("tabindex", context.tabIndex.toString())
      selectContainerElement.appendChild(buttonElement)
      context.tabIndex++

      // Icon
      const iconElement = document.createElement("span")
      iconElement.innerHTML = _constants.iconRadio
      buttonElement.appendChild(iconElement)

      // Title
      const titleElement = document.createElement("span")
      titleElement.textContent = option
      buttonElement.appendChild(titleElement)

      rows.push([buttonElement, iconElement])

      // Interaction
      buttonElement.onclick = () => {
        // Deselect all
        rows.forEach(([otherButtonElement, otherIconElement]) => {
          otherButtonElement.className = ""
          otherIconElement.innerHTML = _constants.iconRadio
        })

        // Select new
        if (entryContent.value == option) {
          entryContent.value = null
          iconElement.innerHTML = _constants.iconRadio
        } else {
          entryContent.value = option
          buttonElement.className = "_q-selected"
          iconElement.innerHTML = _constants.iconRadioChecked
        }

        context.invalidateCanSend()
      }
    })
  }
}
