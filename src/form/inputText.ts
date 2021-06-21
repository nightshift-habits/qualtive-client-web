import { _InputRenderingContext } from "./model"
import { _localized } from "../localized"
import { EntryContentText, QuestionContentText } from "../model"

export const _renderInputText = (
  context: _InputRenderingContext,
  questionContent: QuestionContentText,
  entryContent: EntryContentText
): void => {
  const textareaElement = document.createElement("textarea")
  textareaElement.setAttribute(
    "placeholder",
    questionContent.placeholder || _localized("form.text-placeholder", context.options?.locale)
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
