import { _InputRenderingContext } from "./model"
import { uploadAttachment } from "../attachment"
import { AttachmentContentType, EntryContentAttachments, EnquiryContentAttachments } from "../model"
import { _constants } from "./constants"

export const _renderInputAttachments = (
  context: _InputRenderingContext,
  enquiryContent: EnquiryContentAttachments,
  entryContent: EntryContentAttachments,
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
  const addFile = (file: File) => {
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
  }
  const addFiles = (files: FileList) => {
    for (let index = 0; index < Math.min(files.length, 10); index++) {
      addFile(files[index])
    }

    // Hide remove button if limit reached
    if (entryContent.values.length + files.length >= 10) {
      fileLabelElement.parentElement?.removeChild(fileLabelElement)
    }
  }

  inputElement.addEventListener("change", () => {
    if (!inputElement.files || !inputElement.files.length) return
    addFiles(inputElement.files)

    // Accept new input
    inputElement.value = ""
  })

  // Drop
  if (!context.containerElement.ondrop) {
    let dropIndicationElement: HTMLDivElement | null

    const ondragenter = (event: DragEvent) => {
      event.preventDefault()

      if (context.containerElement.className.indexOf("_q-sent") != -1) return

      context.containerElement.className += " _q-dragging"

      if (!dropIndicationElement) {
        dropIndicationElement = document.createElement("div")
        dropIndicationElement.id = "_q-drop-indication"
        dropIndicationElement.className = "_q-out"

        const rect = context.containerElement.getBoundingClientRect()
        dropIndicationElement.style.left = rect.left + "px"
        dropIndicationElement.style.top = rect.top + "px"
        dropIndicationElement.style.width = rect.width - 40 + "px"
        dropIndicationElement.style.height = rect.height - 40 + "px"

        document.body.appendChild(dropIndicationElement)
      }
      setTimeout(() => {
        if (!dropIndicationElement) return
        dropIndicationElement.className = ""
      }, 1)
    }
    const ondragleave = (event: DragEvent) => {
      event.preventDefault()

      if (context.containerElement.className.indexOf("_q-sent") != -1) return

      context.containerElement.className = context.containerElement.className.replace(" _q-dragging", "")

      if (dropIndicationElement) {
        dropIndicationElement.className = "_q-out"
      }
    }

    context.noClickElement.ondragenter = ondragenter
    context.noClickElement.ondragover = (event) => event.preventDefault()
    context.noClickElement.ondragleave = ondragleave

    context.containerElement.ondragenter = ondragenter
    context.containerElement.ondragover = (event) => event.preventDefault()
    context.containerElement.ondragleave = ondragleave

    // Prevent accedential drop outside the container view
    context.noClickElement.ondrop = (event) => ondragleave(event)

    context.containerElement.ondrop = (event) => {
      ondragleave(event)

      if (context.containerElement.className.indexOf("_q-sent") != -1) return

      if (event.dataTransfer) {
        addFiles(event.dataTransfer.files)
      }
    }
  }
}
