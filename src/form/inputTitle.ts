import { _InputRenderingContext } from "."
import { QuestionContentTitle } from "../model"

export const _renderInputTitle = (context: _InputRenderingContext, questionContent: QuestionContentTitle): void => {
  const titleElement = document.createElement("p")
  titleElement.textContent = questionContent.text
  context.contentElement.appendChild(titleElement)
}
