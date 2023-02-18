import { _locale, _localized } from "./localized"
import { _Options } from "./model"

type Options = _Options & {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  containerId: string
  body?: unknown
}

export const _fetch = <T>(options: Options): Promise<T> => {
  const caller = getCaller()
  if (!caller) return Promise.reject(new Error("Unsupported environment."))

  let url = options._remoteUrl || "https://user-api.qualtive.io"
  url += options.path

  const headers: { [key: string]: string } = {
    "X-Container": options.containerId,
    "Accept-Language": _locale(options),
  }
  if (options.body) {
    headers["Content-Type"] = "application/json; charset=utf-8"
  }
  return caller(options.method, url, headers, options.body)
}

const getCaller = (): RequestCaller | null => {
  if (typeof window !== "undefined") {
    if (typeof window.XMLHttpRequest !== "undefined") return handleXMLHttpRequest
  }
  return null
}

type RequestCaller = <T>(
  method: string,
  url: string,
  headers: { [key: string]: string },
  body: unknown | undefined
) => Promise<T>

const handleXMLHttpRequest: RequestCaller = (method, url, headers, body) =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onload = () => {
      let json: unknown
      try {
        json = JSON.parse(request.responseText)
      } catch (error) {
        if (request.status >= 400) {
          reject(new Error(_localized("ops.fallback-error")))
        } else {
          reject(error)
        }
        return
      }

      if (request.status >= 400) {
        reject((json as { reason?: string }).reason || _localized("ops.fallback-error"))
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve(json as any)
      }
    }
    request.onerror = () => reject(new Error(request.statusText || _localized("ops.fallback-error")))

    request.open(method, url, true)

    Object.keys(headers).forEach((key) => request.setRequestHeader(key, headers[key]))

    request.send(body ? JSON.stringify(body) : undefined)
  })
