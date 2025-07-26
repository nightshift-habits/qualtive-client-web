import type { Enquiry, EnquirySubmittedPage, EnquirySubmittedPageCondition } from "../../types"
import type { PostedEntry, RenderEnquirySubmittedOptions } from "../types"
import { _RenderingContextSubmitted } from "./types"
import { renderStrengthenBy } from "./renderStrengthenBy"
import { renderPageIndicator } from "./renderPageIndicator"
import { renderStyles } from "./renderStyles"
import { renderSubmittedPage } from "./submitted/submitted"
import { renderSubmittedPageUserInput } from "./submitted/userInput/userInput"
import { _parsePadding } from "./utils"
import { _renderUserInputScore } from "./submitted/userInputScore"

export function renderEnquirySubmitted(
  enquiry: Enquiry,
  entry: PostedEntry,
  domNode: HTMLElement,
  options?: RenderEnquirySubmittedOptions,
): { unmount: () => void } {
  let currentPage = entry.pages.length - 1
  const submittedPage = determineSubmittedPage(enquiry, entry)
  const userInputScoreValue = submittedPage.conditions.some(
    (x) => x.type === "score" && x.ranges.some((y) => y.lower === 50),
  )
    ? 100
    : 0

  const styleElement = options?._skipStyles ? null : renderStyles(options, enquiry)
  const padding = _parsePadding(options?.padding)

  const contentElement = (
    <div
      class={
        "_q-content _q-sent" +
        (enquiry.theme.cornerStyle === "rounded" ? " _q-rounded" : "") +
        (enquiry.container.isWhiteLabel ? " _q-white-label" : "")
      }
      style={submittedPage.content[0].type === "userInputScore" ? undefined : `padding:${padding[0]} 0 0`}
    />
  ) as HTMLDivElement

  const renderingContext: _RenderingContextSubmitted = {
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
    padding,
    userInputScoreValue,
  }
  const pages = entry.pages.map((page, index) =>
    renderSubmittedPageUserInput(renderingContext, page.content, index, entry.pages.length),
  )
  const pagerElement = (<div class="_q-pager">{pages[currentPage]}</div>) as HTMLDivElement

  const pageIndicator = renderPageIndicator(renderingContext, currentPage, entry.pages.length)

  domNode.appendChild(contentElement)

  let basedElement: HTMLElement | undefined
  let parentElement = contentElement
  submittedPage.content.forEach((submittedContent) => {
    switch (submittedContent.type) {
      case "userInput":
        parentElement.insertBefore(pagerElement, basedElement ? basedElement.nextSibling : parentElement.children[0])
        if (pageIndicator) parentElement.insertBefore(pageIndicator.element, pagerElement.nextSibling)
        basedElement = pageIndicator?.element ?? pagerElement
        break
      case "userInputScore": {
        const wrapperElement = (
          <div class={`_q-user-input-score-wrapper _q-s${userInputScoreValue}`} />
        ) as HTMLDivElement
        const element = _renderUserInputScore(renderingContext, submittedContent)
        wrapperElement.appendChild(element)
        parentElement.insertBefore(wrapperElement, basedElement ? basedElement.nextSibling : parentElement.children[0])
        basedElement = element as HTMLElement
        parentElement = wrapperElement
        break
      }
      default: {
        const element = renderSubmittedPage(renderingContext, submittedContent)
        if (element) {
          parentElement.insertBefore(element, basedElement ? basedElement.nextSibling : parentElement.children[0])
          basedElement = element as HTMLElement
        }
      }
    }
  })
  if (enquiry.container.isWhiteLabel) {
    if (basedElement) {
      basedElement.style.marginBottom = "0"
    }
    const paddingElement = (<div style={`padding: 0 0 ${padding[2]}`} />) as HTMLDivElement
    parentElement.insertBefore(paddingElement, basedElement ? basedElement.nextSibling : parentElement.children[0])
  } else {
    parentElement.appendChild(renderStrengthenBy(renderingContext, options))
  }

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

export function determineSubmittedPage(enquiry: Enquiry, entry: PostedEntry): EnquirySubmittedPage {
  const score = getPagesScores(entry)
  return (
    enquiry.submittedPages
      .filter((page) => isConditionsSatisfied(page.conditions, score))
      // Assume more conditions == more specific == better match
      .sort((a, b) => b.conditions.length - a.conditions.length)[0]
  )
}

export function getPagesScores(entry: PostedEntry): number | null {
  const scores: number[] = []
  for (const page of entry.pages) {
    for (const content of page.content) {
      switch (content.type) {
        case "score":
          if (typeof content.value === "number") {
            scores.push(content.value)
          }
          break
      }
    }
  }
  if (scores.length === 0) return null

  return scores.reduce((a, b) => a + b, 0) / scores.length
}

export function isConditionsSatisfied(conditions: EnquirySubmittedPageCondition[], score: number | null): boolean {
  return conditions.every((condition) => isConditionSatisfied(condition, score))
}

export function isConditionSatisfied(condition: EnquirySubmittedPageCondition, score: number | null): boolean {
  switch (condition.type) {
    case "score":
      if (score === null) return false
      return condition.ranges.some(
        (range) => (range.lower === null || range.lower < score) && (range.upper === null || range.upper > score),
      )
  }
}
