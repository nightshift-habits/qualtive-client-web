import { _PreviewRenderingContext } from "./model"
import { EntryContentSelect } from "../model"
import { _constants } from "./constants"

export const _renderPreviewSelect = (context: _PreviewRenderingContext, content: EntryContentSelect): void => {
  const divElement = document.createElement("div")
  divElement.className = "_q-option"
  divElement.innerHTML = _constants.iconRadioChecked

  const spanElement = document.createElement("span")
  spanElement.innerText = content.value || ""
  divElement.appendChild(spanElement)

  context.currentResultElement.appendChild(divElement)
}
