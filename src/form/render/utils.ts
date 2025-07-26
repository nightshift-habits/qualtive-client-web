import type { PaddingValue } from "../types"

export type _ParsedPadding = [string, string, string, string]

export function _parsePadding(padding: PaddingValue | null | undefined): _ParsedPadding {
  const trimmed = padding?.trim()
  if (!trimmed) {
    return ["0", "0", "0", "0"]
  }

  const parts = trimmed.split(/\s+/)
  switch (parts.length) {
    case 0:
      return ["0", "0", "0", "0"]
    case 1:
      // All sides the same
      return [parts[0], parts[0], parts[0], parts[0]]
    case 2:
      // top/bottom, left/right
      return [parts[0], parts[1], parts[0], parts[1]]
    case 3:
      // top, left/right, bottom
      return [parts[0], parts[1], parts[2], parts[1]]
    default:
      // top, right, bottom, left
      return [parts[0], parts[1], parts[2], parts[3]]
  }
}

export function _renderHorizontalPadding(parsedPadding: _ParsedPadding): string {
  return `padding:0 ${parsedPadding[1]} 0 ${parsedPadding[3]}`
}
