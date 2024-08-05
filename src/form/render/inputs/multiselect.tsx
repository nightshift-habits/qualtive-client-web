import { _localized } from "../../../localized"
import type { EnquiryContentMultiselect, EntryContentMultiselect } from "../../../types"
import type { _RenderingContext } from "../types"

export function _renderInputMultiselect(
  context: _RenderingContext,
  enquiryContent: EnquiryContentMultiselect,
  entryContent: EntryContentMultiselect,
) {
  const inputName = Math.random()

  return (
    <div class="_q-options">
      {enquiryContent.options.map((option) => {
        const inputElement = (<input type="checkbox" name={inputName} value={option} />) as HTMLInputElement
        inputElement.onchange = () => {
          if (inputElement.checked) {
            entryContent.values.push(option)
          } else {
            const index = entryContent.values.indexOf(option)
            entryContent.values.splice(index, 1)
          }
          context.invalidateCanSend()
        }
        return (
          <label>
            {inputElement}
            <span>
              {renderMutliselectIcon()}
              <span>{option}</span>
            </span>
          </label>
        )
      })}
    </div>
  )
}

export function renderMutliselectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14 1.5H2C1.72386 1.5 1.5 1.72386 1.5 2V14C1.5 14.2761 1.72386 14.5 2 14.5H14C14.2761 14.5 14.5 14.2761 14.5 14V2C14.5 1.72386 14.2761 1.5 14 1.5ZM2 0C0.895431 0 0 0.895431 0 2V14C0 15.1046 0.895431 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2Z"
        fill="#C2C2C2"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 1.50012H14C14.2761 1.50012 14.5 1.72398 14.5 2.00012V14.0001C14.5 14.2763 14.2761 14.5001 14 14.5001H2C1.72386 14.5001 1.5 14.2763 1.5 14.0001V2.00012C1.5 1.72398 1.72386 1.50012 2 1.50012ZM0 2.00012C0 0.895553 0.895431 0.00012207 2 0.00012207H14C15.1046 0.00012207 16 0.895553 16 2.00012V14.0001C16 15.1047 15.1046 16.0001 14 16.0001H2C0.895431 16.0001 0 15.1047 0 14.0001V2.00012ZM13.2207 5.28055C13.5136 4.98765 13.5136 4.51278 13.2207 4.21989C12.9278 3.92699 12.4529 3.92699 12.16 4.21989L6.54093 9.83929C6.44326 9.93695 6.28492 9.93691 6.1873 9.83931L4.28033 7.93278C3.98744 7.63988 3.51257 7.63988 3.21967 7.93277C2.92678 8.22566 2.92678 8.70054 3.21967 8.99343L5.12666 10.9C6.22009 11.9934 6.91813 11.5833 7.60156 10.9L13.2207 5.28055Z"
        fill="#C2C2C2"
      />
    </svg>
  )
}
