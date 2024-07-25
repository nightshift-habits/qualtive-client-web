import { _locale, _localized } from "./localized"
import { RequestCaller, _Options } from "./types"

type Options = _Options & {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  containerId: string
  body?: unknown
}

export const _fetch = <T>(options: Options): Promise<T> => {
  const caller = getCaller(options)
  if (!caller) return Promise.reject(new Error("Unsupported networking environment."))

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

const getCaller = (options: Options): RequestCaller | null => {
  if (options.networking && options.networking != "auto") {
    if (typeof options.networking === "function") {
      return options.networking
    }
    switch (options.networking) {
      case "fetch":
        return handleFetch
      case "xmlhttprequest":
        return handleXMLHttpRequest
      default:
        return null
    }
  }
  if (typeof window !== "undefined") {
    if (typeof window.fetch !== "undefined") return handleFetch
    if (typeof window.XMLHttpRequest !== "undefined") return handleXMLHttpRequest
  }
  if (typeof global !== "undefined") {
    if (typeof global.fetch !== "undefined") return handleFetch
  }
  return null
}

const handleXMLHttpRequest: RequestCaller = (method, url, headers, body) =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onload = () => {
      switch (request.status) {
        case 404:
          reject(new Error("NotFound"))
          return
      }

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
        reject(new Error((json as { reason?: string }).reason || _localized("ops.fallback-error")))
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

const handleFetch: RequestCaller = (method, url, headers, body) => {
  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((response) => {
      switch (response.status) {
        case 404:
          throw new Error("NotFound")
      }

      try {
        return Promise.all([response, response.json()])
      } catch (error) {
        if (response.status >= 400) {
          throw new Error(_localized("ops.fallback-error"))
        }
        throw error
      }
    })
    .then(([response, json]) => {
      if (response.status >= 400) {
        throw new Error((json as { reason?: string }).reason || _localized("ops.fallback-error"))
      }
      return json
    })
}
