import { _localized } from "../../../localized"
import type { EnquiryContentText, EntryContentText } from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderInputText(
  context: _RenderingContext,
  enquiryContent: EnquiryContentText,
  entryContent: EntryContentText,
) {
  const textareaElement = (
    <textarea
      placeholder={enquiryContent.placeholder || _localized("form.text-placeholder", context.options?.locale)}
    />
  ) as HTMLTextAreaElement

  textareaElement.oninput = () => {
    const text = textareaElement.value.trim() == "" ? null : textareaElement.value
    entryContent.value = text
    context.invalidateCanSend()
  }

  return <div style={_renderHorizontalPadding(context.padding)}>{textareaElement}</div>
}
