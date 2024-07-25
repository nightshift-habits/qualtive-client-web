import type { Collection } from "./types"

export const _parseCollection = (collection: Collection): [string, string] => {
  if (typeof collection === "string") {
    return _parseCollectionString(collection)
  }
  if (Array.isArray(collection)) {
    return _parseCollectionArray(collection)
  }
  throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/enquiry-id-or-slug`")
}

function _parseCollectionString(collection: string): [string, string] {
  const components = collection.split("/")
  if (components.length != 2)
    throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/enquiry-id-or-slug`")

  if (!components[0]) throw Error("Invalid container id")
  if (!components[1]) throw Error("Invalid enquiry id")

  return components as [string, string]
}

function _parseCollectionArray(collection: [string, string | number]): [string, string] {
  return [collection[0], collection[1].toString()]
}
