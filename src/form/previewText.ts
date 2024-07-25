import { _PreviewRenderingContext } from "./types"
import { EntryContentText } from "../types"

export const _renderPreviewText = (context: _PreviewRenderingContext, content: EntryContentText): void => {
  const pElement = document.createElement("p")
  pElement.className = "_q-after"
  pElement.innerText = content.value || ""
  context.currentResultElement.appendChild(pElement)
}
