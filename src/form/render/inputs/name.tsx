import type { _RenderingContext } from "../types"

export function _renderInputName(context: _RenderingContext) {
  return <h1>{context.enquiry.name}</h1>
}
