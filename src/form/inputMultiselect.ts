import { _InputRenderingContext } from "./types"
import { EntryContentMultiselect, EnquiryContentMultiselect } from "../types"
import { _constants } from "./constants"

export const _renderInputMultiselect = (
  context: _InputRenderingContext,
  enquiryContent: EnquiryContentMultiselect,
  entryContent: EntryContentMultiselect,
): void => {
  // Container
  const selectContainerElement = document.createElement("div")
  selectContainerElement.className = "_q-options _q-multiselect"
  context.contentElement.appendChild(selectContainerElement)

  // Buttons
  enquiryContent.options.forEach((option) => {
    // Button
    const buttonElement = document.createElement("button")
    buttonElement.setAttribute("tabindex", context.tabIndex.toString())
    selectContainerElement.appendChild(buttonElement)
    context.tabIndex++

    // Icon
    const iconElement = document.createElement("span")
    iconElement.innerHTML = _constants.iconCheck
    buttonElement.appendChild(iconElement)

    // Title
    const titleElement = document.createElement("span")
    titleElement.textContent = option
    buttonElement.appendChild(titleElement)

    // Interaction
    buttonElement.onclick = () => {
      const valueIndex = entryContent.values.indexOf(option)
      if (valueIndex !== -1) {
        entryContent.values.splice(valueIndex, 1)
        buttonElement.className = ""
        iconElement.innerHTML = _constants.iconCheck
      } else {
        entryContent.values.push(option)
        buttonElement.className = "_q-selected"
        iconElement.innerHTML = _constants.iconCheckChecked
      }

      context.invalidateCanSend()
    }
  })
}
