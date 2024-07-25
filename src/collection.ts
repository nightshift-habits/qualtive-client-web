export const _parseCollection = (collection: string): [string, string] => {
  if (typeof collection != "string")
    throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/enquiry-id-or-slug`")

  const components = collection.split("/")
  if (components.length != 2)
    throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/enquiry-id-or-slug`")

  if (!components[0]) throw Error("Invalid container id")
  if (!components[1]) throw Error("Invalid enquiry id")

  return components as [string, string]
}
