import type { _RenderingContextSubmitted } from "../types"
import type {
  EnquirySubmittedContentReviewLinks,
  EnquirySubmittedContentReviewLinksLinkReference,
} from "../../../types"
import type { PostedEntry } from "../../types"
import { _renderHorizontalPadding } from "../utils"
import { _localized } from "../../../localized"
import { _fetch } from "../../../networking"
import { renderArrowDownIcon, renderCheckIcon, renderCopyIcon } from "../../icons"

export function _renderReviewLinks(context: _RenderingContextSubmitted, content: EnquirySubmittedContentReviewLinks) {
  const text = _textToCopy(context.entry)

  const element = (
    <div class="_q-review-links" style={_renderHorizontalPadding(context.padding)}>
      {text && renderCopy(context, text)}
      {content.links.map((link, index) => {
        const linkElement = (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" class="_q-contained">
            {link.logo ? (
              <picture>
                <source media="(prefers-color-scheme: dark)" srcset={link.logo.urlVectorDark} />
                <img src={link.logo.urlVector} alt={link.title} title={link.title} height="24" />
              </picture>
            ) : (
              [
                link.icon && (
                  <picture>
                    <source media="(prefers-color-scheme: dark)" srcset={link.icon.urlRasterDark} />
                    <img src={link.icon.urlRaster} alt="" aria-hidden height="20" />
                  </picture>
                ),
                <span>{link.title}</span>,
              ]
            )}
          </a>
        ) as HTMLAnchorElement
        linkElement.addEventListener("click", () =>
          trackEvent(context, { type: "reviewLinkOpened", link: link.reference }),
        )
        return linkElement
      })}
    </div>
  ) as HTMLDivElement
  return element
}

export function _textToCopy(entry: PostedEntry): string | null {
  const texts = entry.pages
    .flatMap((page) => page.content)
    .map((content) => (content.type === "text" ? content.value?.trim() : null))
    .filter((value): value is string => !!value)
  return texts.length > 0 ? texts.join("\n\n") : null
}

function renderCopy(context: _RenderingContextSubmitted, text: string) {
  const locale = context.options?.locale
  const button = (
    <button type="button" class="_q-contained _q-review-links-copy">
      <span>{_localized("form.review-links.copy", locale)}</span>
      {renderCopyIcon()}
    </button>
  ) as HTMLButtonElement
  button.onclick = () => {
    copyToClipboard(text)
    button.className = "_q-contained _q-review-links-copy _q-copied"
    button.replaceChildren(renderCheckIcon(), (<span>{_localized("form.review-links.copied", locale)}</span>) as Node)
    trackEvent(context, { type: "textCopied" })
  }

  return [
    button,
    <p class="_q-review-links-paste">{_localized("form.review-links.paste", locale)}</p>,
    <div class="_q-review-links-arrow" aria-hidden>
      {renderArrowDownIcon()}
    </div>,
  ]
}

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => copyUsingTextArea(text))
  } else {
    copyUsingTextArea(text)
  }
}

function copyUsingTextArea(text: string) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.setAttribute("readonly", "")
  textArea.style.position = "fixed"
  textArea.style.opacity = "0"
  document.body.appendChild(textArea)
  textArea.select()
  try {
    document.execCommand("copy")
  } finally {
    document.body.removeChild(textArea)
  }
}

type ReviewLinkEvent =
  | { type: "textCopied" }
  | { type: "reviewLinkOpened"; link: EnquirySubmittedContentReviewLinksLinkReference }

function trackEvent(context: _RenderingContextSubmitted, event: ReviewLinkEvent) {
  _fetch({
    ...(context.options || {}),
    method: "POST",
    path: `/feedback/enquiries/${context.enquiry.id}/review-link-events/`,
    containerId: context.containerId,
    body: { ...event, entryId: context.entry.id },
  }).catch(() => {})
}
