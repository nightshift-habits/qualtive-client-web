import type { _RenderingContext } from "../../types"
import type { EntryContentMultiselect } from "../../../../types"
import { renderMutliselectIcon } from "../../inputs/multiselect"

export function _renderMultiselect(_: _RenderingContext, entryContent: EntryContentMultiselect) {
  if (entryContent.values.length === 0) return null
  return (
    <div class="_q-options">
      {entryContent.values.map((value) => (
        <div>
          {renderMutliselectIcon()}
          <span>{value}</span>
        </div>
      ))}
    </div>
  )
}
