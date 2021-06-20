import { Attachment, AttachmentContentType, _Options } from "./model"
import { localized } from "./localized"

/**
 * Optional options to use when uploading an attachment.
 */
export type UploadOptions = _Options

type _Attachment = Attachment & {
  uploadUrl: string
}

/**
 * Uploads an attachment for a future feedback entry.
 * @param containerId Company id/container id to upload to.
 * @param contentType Content type/mime type of the file to upload.
 * @param data File data to upload.
 * @param options Optional options.
 * @returns Promise<Attachment>
 */
export const uploadAttachment = (
  containerId: string,
  contentType: AttachmentContentType,
  data: File,
  options?: UploadOptions
): Promise<Attachment> => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onload = () => {
      let json: unknown
      try {
        json = JSON.parse(request.responseText)
      } catch (error) {
        if (request.status >= 400) {
          reject(new Error(localized("ops.fallback-error")))
        } else {
          reject(error)
        }
        return
      }

      if (request.status >= 400) {
        reject((json as { reason?: string }).reason || localized("ops.fallback-error"))
      } else {
        resolve(_upload(json as _Attachment, contentType, data))
      }
    }
    request.onerror = () => reject(new Error(request.statusText || localized("ops.fallback-error")))

    let url = options?._remoteUrl || "https://user-api.qualtive.io"
    url += "/feedback/attachments/"
    request.open("POST", url, true)

    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.setRequestHeader("X-Container", containerId)

    request.send(
      JSON.stringify({
        contentType,
      })
    )
  })
}

const _upload = (attachment: _Attachment, contentType: AttachmentContentType, data: File): Promise<Attachment> => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onload = () => {
      if (request.status >= 400) {
        reject(localized("ops.fallback-error"))
      } else {
        resolve({
          id: attachment.id,
        })
      }
    }
    request.onerror = () => reject(new Error(request.statusText || localized("ops.fallback-error")))

    request.open("PUT", attachment.uploadUrl, true)
    request.setRequestHeader("Content-Type", contentType)

    request.send(data)
  })
}
