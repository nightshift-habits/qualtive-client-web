import { _localized } from "../../localized"
import type { Enquiry, EntryContent, CustomAttributes, EntryContentText, EnquiryContentText } from "../../types"
import type { PostedEntry, RenderEnquiryOptions } from "../types"
import { post } from "../../post"
import { renderPage } from "./inputs/renderPage"
import { _RenderingContext, _RenderingContextSubmitted } from "./types"
import { renderStrengthenBy } from "./renderStrengthenBy"
import { renderPageIndicator } from "./renderPageIndicator"
import { renderStyles } from "./renderStyles"
import { renderSubmittedPage } from "./submitted/submitted"
import { renderSubmittedPageUserInput } from "./submitted/userInput/userInput"
import { determineSubmittedPage } from "./renderEnquirySubmitted"
import { _parsePadding } from "./utils"
import { _renderUserInputScore } from "./submitted/userInputScore"
import { resolve } from "../../utils"

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

  const styleElement = options?._skipStyles ? null : renderStyles(options, enquiry)
  const padding = _parsePadding(options?.padding)

  const contentElement = (
    <div
      class={
        "_q-content" +
        (enquiry.theme.cornerStyle === "rounded" ? " _q-rounded" : "") +
        (enquiry.container.isWhiteLabel ? " _q-white-label" : "")
      }
      style={`padding:${padding[0]} 0 0`}
    />
  ) as HTMLDivElement

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
      renderingContext.submitButton!.disabled = !_isAnyConterntFilled(enquiry, content)
    },
    padding,
  }

  let pages = enquiry.pages.map((page, index) => renderPage(renderingContext, page, index, content[index]))
  const pagerElement = (<div class="_q-pager">{pages[0]}</div>) as HTMLDivElement
  const form = (<form>{pagerElement}</form>) as HTMLFormElement

  const pageIndicator = renderPageIndicator(renderingContext, 0, enquiry.pages.length)
  if (pageIndicator && enquiry.container.isWhiteLabel) {
    pageIndicator.element.style.paddingBottom = padding[2]
  }

  contentElement.appendChild(form)
  if (pageIndicator) contentElement.appendChild(pageIndicator.element)

  const strengthenByElement = !enquiry.container.isWhiteLabel ? renderStrengthenBy(renderingContext, options) : null
  if (strengthenByElement) contentElement.appendChild(strengthenByElement)
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
        content: _computeContentForPost(enquiry, content),
        user: renderingContext.user,
        customAttributes: _computeAttributesForPost(enquiry, content, options),
      },
      options,
    )
      .then(async (newEntryReference) => {
        const postedEntryPages = content.map((content) => ({
          content: content.filter((x): x is EntryContent => !!x),
        }))
        const postedEntry: PostedEntry = {
          id: newEntryReference.id,
          pages: postedEntryPages,
          content: postedEntryPages.flatMap((x) => x.content),
        }
        if (options?.onSubmitted) {
          try {
            const result = options.onSubmitted(postedEntry)
            if (result instanceof Promise) {
              await result
            }
          } catch (error) {
            console.error("Caught error in onSubmitted callback", error)
          }
        }
        return postedEntry
      })
      .then(async (postedEntry) => {
        contentElement.className = contentElement.className.replace("_q-sending", "_q-sent")

        if (pageIndicator) {
          pageIndicator.element.style.paddingBottom = "0"
        }

        const submittedPage = determineSubmittedPage(enquiry, postedEntry)
        const userInputScoreValue = submittedPage.conditions.some(
          (x) => x.type === "score" && x.ranges.some((y) => y.lower === 50),
        )
          ? 100
          : 0

        const renderingContextSubmitted: _RenderingContextSubmitted = {
          ...renderingContext,
          userInputScoreValue,
        }

        let basedElement: Element | undefined
        let parentElement = contentElement
        submittedPage.content.forEach((submittedContent) => {
          switch (submittedContent.type) {
            case "userInput":
              pagerElement.removeChild(pages[currentPage])
              pages = content.map((page, index) =>
                renderSubmittedPageUserInput(renderingContext, page, index, enquiry.pages.length),
              )
              pagerElement.appendChild(pages[currentPage])
              parentElement.insertBefore(
                pagerElement,
                basedElement ? basedElement.nextSibling : parentElement.children[0],
              )
              basedElement = pagerElement
              if (pageIndicator) {
                parentElement.insertBefore(pageIndicator.element, basedElement.nextSibling)
                basedElement = pageIndicator.element
              }
              contentElement.removeChild(form)
              pagerElement.style.transition = "none"
              pagerElement.style.height = pages[currentPage].getBoundingClientRect().height + "px"
              setTimeout(() => {
                pagerElement.style.transition = ""
              }, 10)
              break
            case "userInputScore": {
              const wrapperElement = (
                <div class={`_q-user-input-score-wrapper _q-s${userInputScoreValue}`} />
              ) as HTMLDivElement
              const element = _renderUserInputScore(renderingContextSubmitted, submittedContent)
              wrapperElement.appendChild(element)
              parentElement.insertBefore(
                wrapperElement,
                basedElement ? basedElement.nextSibling : parentElement.children[0],
              )
              basedElement = element
              parentElement = wrapperElement
              if (strengthenByElement) {
                parentElement.appendChild(strengthenByElement)
              }
              break
            }
            default: {
              const element = renderSubmittedPage(renderingContextSubmitted, submittedContent)
              if (element) {
                parentElement.insertBefore(element, basedElement ? basedElement.nextSibling : parentElement.children[0])
                basedElement = element
              }
            }
          }
        })
        if (form.parentElement) {
          contentElement.removeChild(form)
        }
        if (options?.onSubmittedPageShown) {
          try {
            const result = options.onSubmittedPageShown(postedEntry)
            if (result instanceof Promise) {
              await result
            }
          } catch (error) {
            console.error("Caught error in onSubmittedPageShown callback", error)
          }
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

function _isAnyConterntFilled(enquiry: Enquiry, content: (EntryContent | null)[][]): boolean {
  for (let pageIndex = 0; pageIndex < enquiry.pages.length; pageIndex++) {
    const page = enquiry.pages[pageIndex]
    for (let sectionIndex = 0; sectionIndex < page.content.length; sectionIndex++) {
      const section = page.content[sectionIndex]
      const entry = content[pageIndex]?.[sectionIndex]
      switch (entry?.type) {
        case "title":
          break
        case "score":
          if (typeof entry.value === "number") {
            return true
          }
          break
        case "text":
          switch ((section as EnquiryContentText).storageTarget.type) {
            case "attribute":
              break
            default:
              if (typeof entry.value == "string") {
                return true
              }
          }
          break
        case "select":
          if (typeof entry.value == "string") {
            return true
          }
          break
        case "multiselect":
        case "attachments":
          if (entry.values.length > 0) {
            return true
          }
          break
        default:
          break
      }
    }
  }
  return false
}

function _computeContentForPost(enquiry: Enquiry, content: (EntryContent | null)[][]): EntryContent[] {
  return enquiry.pages.flatMap((page, pageIndex) =>
    page.content
      .map((section, sectionIndex): EntryContent | null => {
        const entry = content[pageIndex]?.[sectionIndex] as EntryContent | null | undefined
        if (!entry) return null

        // Skip content?
        switch (section.type) {
          case "text":
            switch (section.storageTarget.type) {
              case "attribute":
                return null
            }
        }

        // Final mapping
        switch (entry.type) {
          case "attachments":
            return {
              type: "attachments",
              values: entry.values.map((y) => ({ id: y.id })),
            }
          default:
            return entry
        }
      })
      .filter((x): x is EntryContent => !!x),
  )
}

function _computeAttributesForPost(
  enquiry: Enquiry,
  content: (EntryContent | null)[][],
  options: RenderEnquiryOptions | undefined,
): Promise<CustomAttributes> {
  return resolve(options?.customAttributes).then((customAttributes) => {
    const derived = { ...(customAttributes || {}) }
    enquiry.pages.forEach((page, pageIndex) => {
      page.content.forEach((section, sectionIndex) => {
        switch (section.type) {
          case "text":
            switch (section.storageTarget.type) {
              case "attribute": {
                const entry = content[pageIndex][sectionIndex] as EntryContentText | null
                if (entry?.value && entry.value.length > 0) {
                  derived[section.storageTarget.attribute] = entry.value
                }
                break
              }
            }
            break
        }
      })
    })
    return derived
  })
}
