import { _localized } from "../../../localized"
import type {
  EnquiryPage,
  EntryContent,
  EntryContentAttachments,
  EntryContentMultiselect,
  EntryContentScore,
  EntryContentSelect,
  EntryContentText,
  EntryContentTitle,
} from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderInputAttachments } from "./attachment"
import { _renderInputBody } from "./body"
import { _renderInputContactDetails } from "./contactDetails"
import { _renderInputImage } from "./image"
import { _renderInputMultiselect } from "./multiselect"
import { _renderInputName } from "./name"
import { _renderInputScore } from "./score"
import { _renderInputSelect } from "./select"
import { _renderInputText } from "./text"
import { _renderInputTitle } from "./title"

export function renderPage(
  context: _RenderingContext,
  page: EnquiryPage,
  pageIndex: number,
  entryContent: (EntryContent | null)[],
) {
  let button: HTMLButtonElement
  const isLastPage = pageIndex == context.enquiry.pages.length - 1
  if (isLastPage) {
    const buttonSpan = (<span>{_localized("form.send", context.options?.locale)}</span>) as HTMLSpanElement
    button = (
      <button type="submit" disabled class="_q-contained">
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none">
          <path
            d="M15 3V9C15 10.1046 14.1046 11 13 11H5.82843C5.29799 11 4.78929 11.2107 4.41421 11.5858L2.70711 13.2929C2.07714 13.9229 1 13.4767 1 12.5858V3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3Z"
            stroke="#333"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {buttonSpan}
      </button>
    ) as HTMLButtonElement
    context.submitButton = button
    context.submitButtonSpan = buttonSpan
  } else {
    button = (
      <button type="button" class="_q-contained">
        <span>{_localized("form.next", context.options?.locale) + " ->"}</span>
      </button>
    ) as HTMLButtonElement
    button.onclick = context.nextPage
  }
  return (
    <div
      class={`_q-page ${pageIndex == 0 ? "_q-current" : "_q-next"}`}
      style={
        context.enquiry.pages.length === 1 && context.enquiry.container.isWhiteLabel
          ? `padding-bottom:${context.padding[2]}`
          : undefined
      }
    >
      {pageIndex == 0 && _renderInputName(context)}
      {page.content.map((content, index) => {
        switch (content.type) {
          case "title":
            return _renderInputTitle(context, content, entryContent[index] as EntryContentTitle)
          case "body":
            return _renderInputBody(context, content)
          case "image":
            return _renderInputImage(context, content)
          case "score":
            return _renderInputScore(context, content, entryContent[index] as EntryContentScore)
          case "text":
            return _renderInputText(context, content, entryContent[index] as EntryContentText)
          case "select":
            return _renderInputSelect(context, content, entryContent[index] as EntryContentSelect)
          case "multiselect":
            return _renderInputMultiselect(context, content, entryContent[index] as EntryContentMultiselect)
          case "attachments":
            return _renderInputAttachments(context, content, entryContent[index] as EntryContentAttachments)
          case "contactDetails":
            return _renderInputContactDetails(context, content)
        }
      })}
      {button}
    </div>
  ) as HTMLDivElement
}
