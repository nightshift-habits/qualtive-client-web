import type { Enquiry, EntryReference, Collection } from "../types"
import { _parseCollection } from "../collection"
import { getEnquiry } from "../getEnquiry"
import { _localized } from "../localized"
import { Form, FormOptions, PostedEntry } from "./types"
import { renderEnquiry } from "./render/renderEnquiry"
import { renderStyles } from "./render/renderStyles"

const estimatedHeight = 450

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/enquiry-id-or-slug`. Required.
 * @param options Optional options.
 * @returns Form. The presented form.
 */
export const presentEnquiry = (collectionOrEnquiry: Collection | Enquiry, options?: FormOptions): Form => {
  const nativeTakeover = checkNativeTakeover(collectionOrEnquiry)
  if (nativeTakeover) return nativeTakeover

  let postedEntry: (EntryReference & PostedEntry) | null
  let enquiry: Enquiry | null
  let enquiryRender: ReturnType<typeof renderEnquiry> | undefined

  function handleKeydown(event: KeyboardEvent): boolean | undefined {
    if (event.key == "Escape" || event.key == "Esc") {
      const activeElement = document.activeElement
      if (
        !activeElement ||
        (activeElement.tagName != "TEXTAREA" &&
          (activeElement.tagName != "INPUT" || activeElement.getAttribute("type") != "text"))
      ) {
        event.preventDefault()
        dismiss()
        return false
      }
    }
  }

  function dismiss(): void {
    if (options?.disallowKeyboardDismiss != true) {
      window.removeEventListener("keydown", handleKeydown)
    }

    noClickElement.parentElement?.removeChild(noClickElement)
    containerElement.className += " _q-out"

    setTimeout(() => {
      styleElement.parentElement?.removeChild(styleElement)
      containerElement.parentElement?.removeChild(containerElement)
      enquiryRender?.unmount()
    }, 500)

    options?.onDismiss?.(postedEntry)
  }

  const styleElement = renderStyles(options)

  // Add root elements
  const noClickElement = (<div id="_q-no-click" />) as HTMLDivElement
  document.body.appendChild(noClickElement)

  const closeButton = (
    <button type="button" class="_q-cancel" title={_localized("form.close", options?.locale)}>
      <svg fill="none" width="18" height="18" viewBox="0 0 18 18">
        <path
          d="M1 1L17 17M17 1L1 17L17 1Z"
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </button>
  ) as HTMLButtonElement
  closeButton.onclick = dismiss

  let supportLinkElement: Element | undefined

  const containerElement = (
    <div id="_q-container" class="_q-out" style={`max-width:490px;min-height:${estimatedHeight}px`}>
      <div class="_q-header">{closeButton}</div>
    </div>
  ) as HTMLDivElement
  document.body.appendChild(containerElement)

  // Handle keyboard events if needed
  if (options?.disallowKeyboardDismiss != true) {
    window.addEventListener("keydown", handleKeydown)
  }

  // Rendering enquiry and presentation
  function renderContent(enquiryOrError: Enquiry | Error) {
    if (enquiryOrError instanceof Error) {
      enquiryRender = { unmount: () => {} }
      containerElement.appendChild(<p class="_q-error">{enquiryOrError.message}</p>)
    } else {
      enquiryRender = renderEnquiry(enquiryOrError, containerElement, {
        ...(options || {}),
        _containerElement: containerElement,
        _noClickElement: noClickElement,
        _skipStyles: true,
        onSubmitted: (entry) => {
          postedEntry = entry
          options?.onSubmitted?.(entry)

          const dismissButton = (
            <button type="button" class="_q-contained">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1L11 11M11 1L1 11L11 1Z"
                  stroke="#333333"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{_localized("form.close", options?.locale)}</span>
            </button>
          ) as HTMLButtonElement
          dismissButton.onclick = dismiss

          const contentElement = containerElement.children[1]
          if (contentElement.children[contentElement.children.length - 1].className == "_q-qlogo") {
            contentElement.insertBefore(dismissButton, contentElement.children[contentElement.children.length - 1])
          } else {
            contentElement.appendChild(dismissButton)
          }
        },
      })
    }
    if (options?.supportURL) {
      supportLinkElement = (
        <div class="_q-support-link">
          <a href={options.supportURL} target="_blank" rel="noopener noreferrer">
            {_localized("form.support", options.locale) + " ->"}
          </a>
        </div>
      )
      containerElement.appendChild(supportLinkElement)
    }

    containerElement.style.minHeight = "auto"
    if (hasAnimateIn) {
      const targetHeight = containerElement.getBoundingClientRect().height
      containerElement.style.height = estimatedHeight + "px"
      setTimeout(() => {
        containerElement.style.height = targetHeight + "px"
        setTimeout(() => {
          containerElement.style.height = "auto"
        }, 255)
      }, 1)
    }

    setTimeout(() => {
      const anyFocusable = containerElement.querySelector("input,textarea,select,button:not(._q-cancel)") as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | HTMLButtonElement
        | undefined
      if (anyFocusable && !anyFocusable.disabled) {
        anyFocusable.focus?.()
      }
    }, 305)
  }

  // Animate in
  let canRenderEnquiryDirectly = true // If we fetch the enquiry fast we could show the form directly.
  let hasAnimateIn = false

  const animateInIfNeeded = () => {
    if (hasAnimateIn) return
    hasAnimateIn = true
    canRenderEnquiryDirectly = false

    setTimeout(() => {
      containerElement.className = containerElement.className.replace("_q-out", "")
    }, 1)

    if (!enquiryRender) {
      setTimeout(() => {
        if (enquiry) {
          renderContent(enquiry)
        } else {
          canRenderEnquiryDirectly = true
        }
      }, 300)
    }
  }

  const initialAnimateInTimeout = setTimeout(animateInIfNeeded, 200)

  // Get enquiry and display content
  function resolveEnquiry(): Promise<Enquiry> {
    if (!Array.isArray(collectionOrEnquiry) && typeof collectionOrEnquiry === "object") {
      // Must be an enquiry
      return Promise.resolve(collectionOrEnquiry)
    }
    // Must be a collection
    return getEnquiry(collectionOrEnquiry, options)
  }

  let error: Error | undefined
  resolveEnquiry()
    .then((_enquiry) => {
      enquiry = _enquiry
    })
    .catch((maybeError) => {
      error = maybeError instanceof Error ? maybeError : new Error(`${maybeError}`)
      console.error("Failed fetching enquiry", error)
    })
    .finally(() => {
      if (canRenderEnquiryDirectly) {
        clearTimeout(initialAnimateInTimeout)
        renderContent(enquiry || error!)
        setTimeout(animateInIfNeeded, 1)
      }
    })

  return {
    dismiss,
  }
}

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        qualtive?: {
          postMessage: (message: { collection: [string, string] }) => Promise<EntryReference>
        }
      }
    }
  }
}

function checkNativeTakeover(collectionOrEnquiry: Collection | Enquiry): ReturnType<typeof presentEnquiry> | null {
  if (!window.webkit?.messageHandlers?.qualtive) {
    return null
  }

  let collection: [string, string]
  if (!Array.isArray(collectionOrEnquiry) && typeof collectionOrEnquiry === "object") {
    // Must be an enquiry
    collection = [collectionOrEnquiry.container.id, collectionOrEnquiry.id.toString()]
  } else {
    // Must be an collection
    collection = _parseCollection(collectionOrEnquiry)
  }

  window.webkit.messageHandlers.qualtive
    .postMessage({
      collection,
    })
    .catch((error) => {
      if (!`${error}`.includes("CancellationError")) {
        console.error("Error sending Qualtive entry", error)
      }
    })

  return {
    dismiss: () => {
      // Can not dismiss native form.
    },
  }
}

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/enquiry-id-or-slug`. Required.
 * @param options Optional options.
 * @returns Form. The presented form.
 * @deprecated Use presentEnquiry() instead
 */
export const present = presentEnquiry
