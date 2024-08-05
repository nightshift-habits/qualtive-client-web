import type { _RenderingContext } from "../../types"
import type { EntryContentText } from "../../../../types"

export function _renderText(_: _RenderingContext, entryContent: EntryContentText) {
  if (!entryContent.value) return null
  return <p>{entryContent.value}</p>
}
