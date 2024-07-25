import type { Collection, Enquiry, _Options } from "./types"
import { _parseCollection } from "./collection"
import { _fetch } from "./networking"

/**
 * Optional options to use when fetching feedback question using custom UI.
 */
export type GetEnquiryOptions = _Options & {
  previewToken?: string | null
}

/**
 * Fetches a enquiry and it's structure.
 * @param collection Collection to get enquiry. Formatted as `container-id/enquiry-id-or-slug`. Required.
 * @param options Optional options.
 * @returns Promise<Enquiry>
 */
export const getEnquiry = (collection: Collection, options?: GetEnquiryOptions): Promise<Enquiry> => {
  const [containerId, enquiryId] = _parseCollection(collection)

  let path = `/feedback/enquiries/${enquiryId}/`
  if (options?.previewToken) {
    path += "?previewToken=" + options.previewToken
  }

  return _fetch({
    ...(options || {}),
    method: "GET",
    path,
    containerId,
  })
}
