export const parseCollection = (collection: string): string[] => {
  if (typeof collection != "string")
    throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/question-id`")

  const components = collection.split("/")
  if (components.length != 2)
    throw Error("Invalid collection. First parameter to `post` must be formatted as `container-id/question-id`")

  if (!components[0]) throw Error("Invalid container id")
  if (!components[1]) throw Error("Invalid question id")

  return components
}
