import { _PreviewRenderingContext } from "./model"
import { _localized } from "../localized"
import { EntryContentAttachments } from "../model"

export const _renderPreviewAttachments = (
  context: _PreviewRenderingContext,
  content: EntryContentAttachments
): void => {
  const divElement = document.createElement("div")
  divElement.className = "_q-attached"
  context.currentResultElement.appendChild(divElement)

  content.values.forEach((attachment, index) => {
    const imgElement = document.createElement("img")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    imgElement.setAttribute("src", (attachment as any).localUrl)
    imgElement.setAttribute("title", _localized("form.image.index") + (index + 1))
    divElement.appendChild(imgElement)
  })
}
