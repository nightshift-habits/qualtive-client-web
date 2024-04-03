import { _PreviewRenderingContext } from "./model"
import { EntryContentText } from "../model"

export const _renderPreviewText = (context: _PreviewRenderingContext, content: EntryContentText): void => {
  const pElement = document.createElement("p")
  pElement.className = "_q-after"
  pElement.innerText = content.value || ""
  context.currentResultElement.appendChild(pElement)
}
