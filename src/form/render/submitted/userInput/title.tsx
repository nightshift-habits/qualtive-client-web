import type { _RenderingContext } from "../../types"
import type { EntryContentTitle } from "../../../../types"

export function _renderTitle(_: _RenderingContext, entryContent: EntryContentTitle) {
  return <h3>{entryContent.text}</h3>
}
