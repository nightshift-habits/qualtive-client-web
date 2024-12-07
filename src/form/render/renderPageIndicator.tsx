import { _localized } from "../../localized"
import type { _RenderingContext } from "./types"

export function renderPageIndicator(
  context: _RenderingContext,
  currentPage: number,
  pageCount: number,
): {
  element: Element
  didChangePage: (currentPage: number) => void
} | null {
  if (pageCount <= 1) return null

  const labelSpan = (<span>{`1/${pageCount}`}</span>) as HTMLSpanElement
  const previousPageButton = (
    <button type="button" title={_localized("form.page-back", context.options?.locale)} disabled={currentPage == 0}>
      {"<-"}
    </button>
  ) as HTMLButtonElement
  previousPageButton.onclick = context.previousPage

  let maxPage = currentPage
  const rows: ReturnType<typeof renderPageRow>[] = []
  while (rows.length <= Math.min(pageCount - 1, currentPage + 1)) {
    rows.push(renderPageRow(context, rows.length))
  }
  rows[currentPage].button.disabled = true

  const listElement = (<ul>{rows.map((x) => x.element)}</ul>) as HTMLUListElement

  return {
    element: (
      <div class="_q-page-indicator">
        {previousPageButton}
        {listElement}
        {labelSpan}
      </div>
    ),
    didChangePage: (currentPage) => {
      previousPageButton.disabled = currentPage == 0

      maxPage = Math.max(maxPage, currentPage)
      while (rows.length <= Math.min(pageCount - 1, currentPage + 1)) {
        const row = renderPageRow(context, rows.length)
        rows.push(row)
        listElement.appendChild(row.element)

        row.element.style.flex = "0 0 auto"
        row.element.style.width = "10px"
        row.element.style.marginLeft = "-10px"
        setTimeout(() => {
          const boundingWidth = listElement.getBoundingClientRect().width
          row.element.style.width = boundingWidth / rows.length + "px"
          row.element.style.marginLeft = "0px"
          setTimeout(() => {
            row.element.style.width = "auto"
            row.element.style.flex = "1 0 auto"
          }, 305)
        }, 1)
      }
      rows.forEach((x) => (x.button.disabled = false))
      rows[currentPage].button.disabled = true
      labelSpan.innerText = `${currentPage + 1}/${pageCount}`
    },
  }
}

function renderPageRow(
  context: _RenderingContext,
  index: number,
): { element: HTMLUListElement; button: HTMLButtonElement } {
  const button = (
    <button
      type="button"
      title={_localized("form.page-exact", context.options?.locale).replace("{page}", (index + 1).toString())}
    >
      <span />
    </button>
  ) as HTMLButtonElement
  button.onclick = () => context.setPage(index)

  return { element: (<li>{button}</li>) as HTMLUListElement, button }
}
