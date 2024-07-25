import { _InputRenderingContext } from "./types"
import { _localized } from "../localized"
import { EntryContentText, EnquiryContentText } from "../types"

export const _renderInputText = (
  context: _InputRenderingContext,
  enquiryContent: EnquiryContentText,
  entryContent: EntryContentText,
): void => {
  const textareaElement = document.createElement("textarea")
  textareaElement.setAttribute(
    "placeholder",
    enquiryContent.placeholder || _localized("form.text-placeholder", context.options?.locale),
  )
  textareaElement.setAttribute("tabindex", context.tabIndex.toString())
  context.contentElement.appendChild(textareaElement)
  context.tabIndex++

  textareaElement.oninput = () => {
    const text = textareaElement.value.trim() == "" ? null : textareaElement.value
    entryContent.value = text
    context.invalidateCanSend()
  }
}
