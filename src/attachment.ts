import { Attachment, AttachmentContentType, _Options } from "./model"
import { _localized } from "./localized"

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
  options?: UploadOptions,
): Promise<Attachment> => {
  return new Promise((resolve, reject) => {
    const initRequest = new XMLHttpRequest()
    initRequest.onload = () => {
      let json: unknown
      try {
        json = JSON.parse(initRequest.responseText)
      } catch (error) {
        if (initRequest.status >= 400) {
          return reject(new Error(_localized("ops.fallback-error")))
        }
        return reject(error)
      }

      if (initRequest.status >= 400) {
        return reject((json as { reason?: string }).reason || _localized("ops.fallback-error"))
      }

      const attachment = json as _Attachment

      const uploadRequest = new XMLHttpRequest()
      uploadRequest.onload = () => {
        if (uploadRequest.status >= 400) {
          return reject(_localized("ops.fallback-error"))
        }
        resolve({
          id: attachment.id,
        })
      }
      uploadRequest.onerror = () => reject(new Error(uploadRequest.statusText || _localized("ops.fallback-error")))

      uploadRequest.open("PUT", attachment.uploadUrl, true)
      uploadRequest.setRequestHeader("Content-Type", contentType)

      uploadRequest.send(data)
    }
    initRequest.onerror = () => reject(new Error(initRequest.statusText || _localized("ops.fallback-error")))
    initRequest.open("POST", (options?._remoteUrl || "https://user-api.qualtive.io") + "/feedback/attachments/", true)

    initRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    initRequest.setRequestHeader("X-Container", containerId)

    initRequest.send(
      JSON.stringify({
        contentType,
      }),
    )
  })
}
