import type { _RenderingContext } from "../../types"
import type { EntryContentSelect } from "../../../../types"
import { renderSelectIcon } from "../../inputs/select"

export function _renderSelect(_: _RenderingContext, entryContent: EntryContentSelect) {
  if (!entryContent.value) return null
  return (
    <div class="_q-options">
      <div>
        {renderSelectIcon()}
        <span>{entryContent.value}</span>
      </div>
    </div>
  )
}
