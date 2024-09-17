import { _localized } from "../../localized"
import type { Enquiry, EntryContent } from "../../types"
import type { RenderEnquiryOptions } from "../types"
import { post } from "../../post"
import { renderPage } from "./inputs/renderPage"
import { _RenderingContext } from "./types"
import { renderStrengthenBy } from "./renderStrengthenBy"
import { renderPageIndicator } from "./renderPageIndicator"
import { renderStyles } from "./renderStyles"
import { renderSubmittedPage } from "./submitted/submitted"
import { renderSubmittedPageUserInput } from "./submitted/userInput/userInput"

export function renderEnquiry(
  enquiry: Enquiry,
  domNode: HTMLElement,
  options?: RenderEnquiryOptions,
): { unmount: () => void } {
  let currentPage = 0

  const content: (EntryContent | null)[][] = enquiry.pages.map((page) =>
    page.content
      .map((x): EntryContent | null | undefined => {
        switch (x.type) {
          case "title":
            return { type: "title", text: x.text }
          case "score":
            return {
              type: "score",
              value: null,
              scoreType: x.scoreType,
              leadingText: x.leadingText,
              trailingText: x.trailingText,
            }
          case "text":
            return { type: "text", value: null }
          case "select":
            return { type: "select", value: null }
          case "multiselect":
            return { type: "multiselect", values: [] }
          case "attachments":
            return { type: "attachments", values: [] }
          case "body":
          case "contactDetails":
          case "image":
            return null
          default:
            return undefined
        }
      })
      .filter((x): x is EntryContent | null => x !== undefined),
  )

  const styleElement = options?._skipStyles ? null : renderStyles(options)

  const contentElement = (<div class="_q-content" />) as HTMLDivElement

  const renderingContext: _RenderingContext = {
    containerId: enquiry.container.id,
    containerElement: options?._containerElement,
    noClickElement: options?._noClickElement,
    contentElement,
    options,
    enquiry,
    previousPage: () => setPage(currentPage - 1),
    nextPage: () => setPage(currentPage + 1),
    setPage,
    user: options?.user,
    invalidateCanSend: () => {
      renderingContext.submitButton!.disabled = !content
        .flatMap((x) => x)
        .some((x) => {
          switch (x?.type) {
            case "title":
              return false
            case "score":
              return typeof x.value == "number"
            case "text":
            case "select":
              return typeof x.value == "string"
            case "multiselect":
            case "attachments":
              return x.values.length > 0
            default:
              return false
          }
        })
    },
  }
  let pages = enquiry.pages.map((page, index) => renderPage(renderingContext, page, index, content[index]))
  const pagerElement = (<div class="_q-pager">{pages[0]}</div>) as HTMLDivElement
  const form = (<form>{pagerElement}</form>) as HTMLFormElement

  const pageIndicator = renderPageIndicator(renderingContext)

  contentElement.appendChild(form)
  if (pageIndicator) contentElement.appendChild(pageIndicator.element)
  if (!enquiry.container.isWhiteLabel) contentElement.appendChild(renderStrengthenBy(options))
  domNode.appendChild(contentElement)

  let errorSpan: HTMLSpanElement | undefined

  form.onsubmit = (event) => {
    event.preventDefault()
    if (contentElement.className.indexOf("_q-sending") != -1) return

    contentElement.className = contentElement.className.replace("_q-error", "") + " _q-sending"
    if (errorSpan) {
      contentElement.removeChild(errorSpan)
    }
    renderingContext.submitButton!.disabled = true
    renderingContext.submitButtonSpan!.textContent = _localized("form.sending", options?.locale)

    post(
      [enquiry.container.id, enquiry.id],
      {
        content: content
          .flatMap((x) => x)
          .filter((x): x is EntryContent => !!x)
          .map((x) => {
            switch (x.type) {
              case "attachments":
                return {
                  type: "attachments",
                  values: x.values.map((y) => ({
                    id: y.id,
                  })),
                }
              default:
                return x
            }
          }),
        user: renderingContext.user,
        customAttributes: options?.customAttributes,
      },
      options,
    )
      .then((newEntryReference) => {
        options?.onSubmitted?.({
          id: newEntryReference.id,
          content: content.flatMap((x) => x).filter((x): x is EntryContent => !!x),
        })
        contentElement.className = contentElement.className.replace("_q-sending", "_q-sent")
        let basedElement: Element | undefined
        enquiry.submittedPage.content.forEach((submittedContent) => {
          switch (submittedContent.type) {
            case "userInput":
              pagerElement.removeChild(pages[currentPage])
              pages = content.map((page, index) => renderSubmittedPageUserInput(renderingContext, page, index))
              pagerElement.appendChild(pages[currentPage])
              contentElement.insertBefore(pagerElement, form)
              contentElement.removeChild(form)
              basedElement = pageIndicator?.element ?? pagerElement
              pagerElement.style.transition = "none"
              pagerElement.style.height = pages[currentPage].getBoundingClientRect().height + "px"
              setTimeout(() => {
                pagerElement.style.transition = ""
              }, 10)
              break
            default: {
              const element = renderSubmittedPage(renderingContext, submittedContent)
              if (element) {
                contentElement.insertBefore(
                  element,
                  basedElement ? basedElement.nextSibling : contentElement.children[0],
                )
                basedElement = element
              }
            }
          }
        })
        if (form.parentElement) {
          contentElement.removeChild(form)
        }
      })
      .catch((error) => {
        contentElement.className = contentElement.className.replace("_q-sending", "_q-error")
        renderingContext.submitButton!.disabled = false
        renderingContext.submitButtonSpan!.textContent = _localized("form.send", options?.locale)

        errorSpan = (<span>{_localized("form.error", options?.locale)}</span>) as HTMLSpanElement
        contentElement.appendChild(errorSpan)

        console.error("Error sending Qualtive entry", error)
      })
  }

  // Set initial height of pager. Using auto height first with delay before computing in case of the content is being animated with a size change
  pagerElement.style.height = "auto"
  pages[0].style.position = "static"
  setTimeout(() => {
    pages[0].style.position = ""
    pagerElement.style.height = pages[0].getBoundingClientRect().height + "px"
  }, 500)

  function setPage(newPage: number) {
    const oldPage = currentPage
    const oldPageElement = pages[oldPage]
    if (newPage > oldPage) {
      for (let index = oldPage; index < newPage; index += 1) {
        pages[index].className = pages[index].className.replace("_q-current", "_q-prev")
      }
    } else {
      for (let index = oldPage; index > newPage; index -= 1) {
        pages[index].className = pages[index].className.replace("_q-current", "_q-next")
      }
    }

    currentPage = newPage
    pageIndicator?.didChangePage(newPage)

    const newPageElement = pages[currentPage]
    pagerElement.appendChild(newPageElement)
    setTimeout(() => {
      pagerElement.style.height = newPageElement.getBoundingClientRect().height + "px"
      if (newPage > oldPage) {
        pages[newPage].className = pages[newPage].className.replace("_q-next", "_q-current")

        for (let index = newPage - 1; index > oldPage; index -= 1) {
          pages[index].className = pages[index].className.replace("_q-next", "_q-prev")
        }
      } else {
        pages[newPage].className = pages[newPage].className.replace("_q-prev", "_q-current")

        for (let index = newPage + 1; index < oldPage; index += 1) {
          pages[index].className = pages[index].className.replace("_q-prev", "_q-next")
        }
      }

      setTimeout(() => {
        pagerElement.removeChild(oldPageElement)

        const anyFocusables = pages[currentPage].querySelectorAll("input,textarea,select,button") as NodeListOf<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement
        >

        const anyFocusable = newPage > oldPage ? anyFocusables[0] : anyFocusables[anyFocusables.length - 1]
        if (anyFocusable && !anyFocusable.disabled) {
          anyFocusable.focus?.()
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(document.activeElement as any)?.blur?.()
        }
      }, 305)
    }, 0)
  }

  return {
    unmount: () => {
      if (styleElement) {
        styleElement.parentElement?.removeChild(styleElement)
      }
      domNode.removeChild(contentElement)
    },
  }
}
