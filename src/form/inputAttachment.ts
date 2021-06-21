import { _InputRenderingContext } from "."
import { uploadAttachment } from "../attachment"
import { AttachmentContentType, EntryContentAttachments, QuestionContentAttachments } from "../model"
import { _constants } from "./constants"

export const _renderInputAttachments = (
  context: _InputRenderingContext,
  questionContent: QuestionContentAttachments,
  entryContent: EntryContentAttachments
): void => {
  // Container
  const attachmentsElement = document.createElement("div")
  attachmentsElement.className = "_q-attachments"
  context.contentElement.appendChild(attachmentsElement)

  // Add label
  const fileLabelElement = document.createElement("label")
  fileLabelElement.setAttribute("title", "Add image")
  fileLabelElement.innerHTML = _constants.iconAddAttachment
  attachmentsElement.appendChild(fileLabelElement)

  // File input
  const inputElement = document.createElement("input")
  inputElement.setAttribute("type", "file")
  inputElement.setAttribute("accept", "image/png,image/jpeg")
  inputElement.setAttribute("multiple", "")
  inputElement.setAttribute("tabindex", context.tabIndex.toString())
  fileLabelElement.appendChild(inputElement)
  context.tabIndex++

  // Interaction
  inputElement.addEventListener("change", () => {
    if (!inputElement.files || !inputElement.files.length) return

    // Upload each attachment
    for (let index = 0; index < Math.min(inputElement.files.length, 10); index++) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;((index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const file = inputElement.files![index]
        if (file.type != "image/png" && file.type != "image/jpeg") return

        // Create remove button with preview
        const removeButton = document.createElement("button")
        removeButton.innerHTML = _constants.iconRemoveAttachment
        removeButton.setAttribute("title", "Click to remove")
        attachmentsElement.insertBefore(removeButton, fileLabelElement)

        const fileReader = new FileReader()
        fileReader.onload = () => {
          const localUrl = fileReader.result
          removeButton.style.backgroundImage = "url('" + localUrl + "')"

          uploadAttachment(context.containerId, file.type as AttachmentContentType, file, context.options)
            .then((attachment) => {
              // eslint-disable-next-line @typescript-eslint/no-extra-semi, @typescript-eslint/no-explicit-any
              ;(attachment as any).localUrl = localUrl
              entryContent.values.push(attachment)
              context.invalidateCanSend()

              removeButton.onclick = () => {
                for (let index = 0; index < entryContent.values.length; index++) {
                  if (entryContent.values[index].id == attachment.id) {
                    entryContent.values.splice(index, 1)
                    attachmentsElement.removeChild(removeButton)
                    if (!fileLabelElement.parentElement) {
                      attachmentsElement.appendChild(fileLabelElement)
                    }
                    context.invalidateCanSend()
                    break
                  }
                }
              }
            })
            .catch((error) => {
              console.error("Failed attachment upload", error)
              attachmentsElement.removeChild(removeButton)
            })
        }
        fileReader.readAsDataURL(file)
      })(index)
    }

    // Hide remove button if limit reached
    if (entryContent.values.length + inputElement.files.length >= 10) {
      fileLabelElement.parentElement?.removeChild(fileLabelElement)
    }

    // Accept new input
    inputElement.value = ""
  })
}
