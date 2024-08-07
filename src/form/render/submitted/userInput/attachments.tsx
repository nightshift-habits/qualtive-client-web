import type { _RenderingContext } from "../../types"
import type { EntryContentAttachments } from "../../../../types"

export function _renderAttachments(_: _RenderingContext, entryContent: EntryContentAttachments) {
  if (entryContent.values.length == 0) return null

  return (
    <div class="_q-attachments">
      {entryContent.values.map((value) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <img src={(value as any).localUrl} />
      ))}
    </div>
  )
}
