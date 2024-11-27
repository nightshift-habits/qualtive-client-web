import { uploadAttachment } from "../../../attachment"
import type { AttachmentContentType, EnquiryContentAttachments, EntryContentAttachments } from "../../../types"
import type { _RenderingContext } from "../types"

export function _renderInputAttachments(
  context: _RenderingContext,
  _: EnquiryContentAttachments,
  entryContent: EntryContentAttachments,
) {
  const inputElement = (<input type="file" accept="image/png,image/jpeg" multiple />) as HTMLInputElement

  const fileLabelElement = (
    <label title="Add image">
      {inputElement}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect
          x="0.5"
          y="0.5"
          width="39"
          height="39"
          rx="5.5"
          stroke="#000"
          stroke-opacity="0.4"
          stroke-dasharray="4 4"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M26 14.5H14C13.7239 14.5 13.5 14.7239 13.5 15V22.6762L15.5602 21.1065C16.0817 20.7092 16.7814 20.6366 17.3732 20.9185L19.6918 22.0225C19.7865 22.0676 19.8992 22.0488 19.9742 21.9754L22.9257 19.0841C23.5578 18.4649 24.5526 18.415 25.2435 18.9677L26.5 19.9729V15C26.5 14.7239 26.2761 14.5 26 14.5ZM26.5 21.8938L24.3065 20.139C24.2078 20.06 24.0657 20.0672 23.9754 20.1556L21.0239 23.0469C20.4993 23.5608 19.7098 23.6925 19.0469 23.3768L16.7283 22.2727C16.6438 22.2325 16.5438 22.2428 16.4693 22.2996L13.5 24.5619V25C13.5 25.2761 13.7239 25.5 14 25.5H26C26.2761 25.5 26.5 25.2761 26.5 25V21.8938ZM14 13C12.8954 13 12 13.8954 12 15V25C12 26.1046 12.8954 27 14 27H26C27.1046 27 28 26.1046 28 25V15C28 13.8954 27.1046 13 26 13H14ZM17 17.5C17 16.6716 17.6716 16 18.5 16C19.3284 16 20 16.6716 20 17.5C20 18.3284 19.3284 19 18.5 19C17.6716 19 17 18.3284 17 17.5Z"
          fill="#000"
        />
      </svg>
    </label>
  ) as HTMLLabelElement

  const containerElement = <div class="_q-attachments">{fileLabelElement}</div>

  function addFile(file: File) {
    if (file.type != "image/png" && file.type != "image/jpeg") return

    // Create remove button with preview
    const removeButton = (
      <button type="button" title="Click to remove">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
          <rect width="19" height="19" fill="#EB5757" />
          <rect x="5" y="8.625" width="9" height="1.75" fill="#fff" />
        </svg>
      </button>
    ) as HTMLButtonElement
    containerElement.insertBefore(removeButton, fileLabelElement)

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const localUrl = fileReader.result
      removeButton.style.backgroundImage = "url('" + localUrl + "')"

      uploadAttachment(context.containerId, file.type as AttachmentContentType, file, context.options)
        .then((attachment) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(attachment as any).localUrl = localUrl
          entryContent.values.push(attachment)
          context.invalidateCanSend()

          removeButton.onclick = () => {
            for (let index = 0; index < entryContent.values.length; index++) {
              if (entryContent.values[index].id == attachment.id) {
                entryContent.values.splice(index, 1)
                containerElement.removeChild(removeButton)
                if (!fileLabelElement.parentElement) {
                  containerElement.appendChild(fileLabelElement)
                }
                context.invalidateCanSend()
                break
              }
            }
          }
        })
        .catch((error) => {
          console.error("Failed attachment upload", error)
          containerElement.removeChild(removeButton)
        })
    }
    fileReader.readAsDataURL(file)
  }
  function addFiles(files: FileList) {
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
  const dropElement = context.containerElement ?? context.contentElement
  if (!dropElement.ondrop) {
    let dropIndicationElement: HTMLDivElement | null

    const ondragenter = (event: DragEvent) => {
      event.preventDefault()

      if (dropElement.querySelector("._q-sent")) return

      dropElement.className += " _q-dragging"

      if (!dropIndicationElement) {
        dropIndicationElement = document.createElement("div")
        dropIndicationElement.id = "_q-drop-indication"
        dropIndicationElement.className = "_q-out"

        const rect = dropElement.getBoundingClientRect()
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

      if (dropElement.querySelector("._q-sent")) return

      dropElement.className = dropElement.className.replace(" _q-dragging", "")

      if (dropIndicationElement) {
        dropIndicationElement.className = "_q-out"
      }
    }

    if (context.noClickElement) {
      context.noClickElement.ondragenter = ondragenter
      context.noClickElement.ondragover = (event) => event.preventDefault()
      context.noClickElement.ondragleave = ondragleave
    }

    dropElement.ondragenter = ondragenter
    dropElement.ondragover = (event) => event.preventDefault()
    dropElement.ondragleave = ondragleave

    // Prevent accedential drop outside the container view
    if (context.noClickElement) {
      context.noClickElement.ondrop = (event) => ondragleave(event)
    }

    dropElement.ondrop = (event) => {
      ondragleave(event)

      if (dropElement.querySelector("._q-sent")) return

      if (event.dataTransfer) {
        addFiles(event.dataTransfer.files)
      }
    }
  }

  return containerElement
}
