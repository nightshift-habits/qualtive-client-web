import { _PreviewRenderingContext } from "."
import { EntryContentMultiselect } from "../model"
import { _constants } from "./constants"

export const _renderPreviewMultiselect = (
  context: _PreviewRenderingContext,
  content: EntryContentMultiselect
): void => {
  content.values.forEach((value) => {
    const divElement = document.createElement("div")
    divElement.className = "_q-option"
    divElement.innerHTML = _constants.iconCheckChecked

    const spanElement = document.createElement("span")
    spanElement.innerText = value
    divElement.appendChild(spanElement)

    context.currentResultElement.appendChild(divElement)
  })
}
