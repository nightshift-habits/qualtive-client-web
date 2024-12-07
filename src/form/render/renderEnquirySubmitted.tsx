import type { Enquiry } from "../../types"
import type { PostedEntry, RenderEnquirySubmittedOptions } from "../types"
import { _RenderingContext } from "./types"
import { renderStrengthenBy } from "./renderStrengthenBy"
import { renderPageIndicator } from "./renderPageIndicator"
import { renderStyles } from "./renderStyles"
import { renderSubmittedPage } from "./submitted/submitted"
import { renderSubmittedPageUserInput } from "./submitted/userInput/userInput"

export function renderEnquirySubmitted(
  enquiry: Enquiry,
  entry: PostedEntry,
  domNode: HTMLElement,
  options?: RenderEnquirySubmittedOptions,
): { unmount: () => void } {
  let currentPage = entry.pages.length - 1

  const styleElement = options?._skipStyles ? null : renderStyles(options)

  const contentElement = (<div class="_q-content _q-sent" />) as HTMLDivElement

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
    user: undefined,
    invalidateCanSend: () => {},
  }
  const pages = entry.pages.map((page, index) =>
    renderSubmittedPageUserInput(renderingContext, page.content, index, entry.pages.length),
  )
  const pagerElement = (<div class="_q-pager">{pages[currentPage]}</div>) as HTMLDivElement

  const pageIndicator = renderPageIndicator(renderingContext, currentPage, entry.pages.length)

  contentElement.appendChild(pagerElement)
  if (pageIndicator) contentElement.appendChild(pageIndicator.element)
  if (!enquiry.container.isWhiteLabel) contentElement.appendChild(renderStrengthenBy(options))
  domNode.appendChild(contentElement)

  let basedElement: Element | undefined
  enquiry.submittedPage.content.forEach((submittedContent) => {
    switch (submittedContent.type) {
      case "userInput":
        basedElement = pageIndicator?.element ?? pagerElement
        break
      default: {
        const element = renderSubmittedPage(renderingContext, submittedContent)
        if (element) {
          contentElement.insertBefore(element, basedElement ? basedElement.nextSibling : contentElement.children[0])
          basedElement = element
        }
      }
    }
  })

  // Set initial height of pager. Using auto height first with delay before computing in case of the content is being animated with a size change
  pagerElement.style.height = "auto"
  pages[currentPage].style.position = "static"
  setTimeout(() => {
    pages[currentPage].style.position = ""
    pagerElement.style.height = pages[currentPage].getBoundingClientRect().height + "px"
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
