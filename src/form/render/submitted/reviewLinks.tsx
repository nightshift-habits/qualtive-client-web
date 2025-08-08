import type { _RenderingContext } from "../types"
import type { EnquirySubmittedContentReviewLinks } from "../../../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderReviewLinks(context: _RenderingContext, content: EnquirySubmittedContentReviewLinks) {
  return (
    <div class="_q-review-links" style={_renderHorizontalPadding(context.padding)}>
      {content.links.map((link, index) => (
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
      ))}
    </div>
  )
}
