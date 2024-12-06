import type { Resolvable } from "./types"

export function resolve<T>(value: Resolvable<T>): Promise<T> {
  if (typeof value === "function") {
    const result = (value as (() => T) | (() => Promise<T>))()
    return resolve(result)
  }
  return value instanceof Promise ? value : Promise.resolve(value)
}
