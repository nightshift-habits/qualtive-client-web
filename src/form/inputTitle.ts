import { _InputRenderingContext } from "./model"
import { EnquiryContentTitle } from "../model"

export const _renderInputTitle = (context: _InputRenderingContext, enquiryContent: EnquiryContentTitle): void => {
  const titleElement = document.createElement("p")
  titleElement.textContent = enquiryContent.text
  context.contentElement.appendChild(titleElement)
}
