import type { Enquiry } from "../../types"
import type { FormOptions } from "../types"

export type _RenderingContext = {
  containerId: string
  containerElement?: HTMLElement
  noClickElement?: HTMLElement
  contentElement: HTMLElement
  options: FormOptions | undefined
  enquiry: Enquiry
  submitButton?: HTMLButtonElement
  submitButtonSpan?: HTMLSpanElement
  previousPage: () => void
  nextPage: () => void
  setPage: (newPage: number) => void
  invalidateCanSend: () => void
}
