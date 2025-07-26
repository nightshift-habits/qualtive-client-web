import type { _RenderingContext } from "../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderInputName(context: _RenderingContext) {
  return <h1 style={_renderHorizontalPadding(context.padding)}>{context.enquiry.name}</h1>
}
