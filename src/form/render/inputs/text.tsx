import { _localized } from "../../../localized"
import type { EnquiryContentText, EntryContentText } from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderInputText(
  context: _RenderingContext,
  enquiryContent: EnquiryContentText,
  entryContent: EntryContentText,
) {
  const placeholder = enquiryContent.placeholder || _localized("form.text-placeholder", context.options?.locale)
  const element = (
    enquiryContent.storageTarget.type === "attribute" ? (
      <input type="text" placeholder={placeholder} />
    ) : (
      <textarea placeholder={placeholder} />
    )
  ) as HTMLInputElement | HTMLTextAreaElement

  element.oninput = () => {
    const value = element.value
    const text = value.trim() == "" ? null : value
    entryContent.value = text
    context.invalidateCanSend()
  }

  return <div style={_renderHorizontalPadding(context.padding)}>{element}</div>
}
