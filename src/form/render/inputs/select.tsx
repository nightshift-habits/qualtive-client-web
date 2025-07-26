import { _localized } from "../../../localized"
import type { EnquiryContentSelect, EntryContentSelect } from "../../../types"
import type { _RenderingContext } from "../types"
import { _renderHorizontalPadding } from "../utils"

export function _renderInputSelect(
  context: _RenderingContext,
  enquiryContent: EnquiryContentSelect,
  entryContent: EntryContentSelect,
) {
  const inputName = Math.random()

  return (
    <div class="_q-options" style={_renderHorizontalPadding(context.padding)}>
      {enquiryContent.options.map((option) => {
        const inputElement = (<input type="radio" name={inputName} value={option} />) as HTMLInputElement
        inputElement.onchange = () => {
          entryContent.value = inputElement.checked ? option : null
          context.invalidateCanSend()
        }
        return (
          <label>
            {inputElement}
            <span>
              {renderSelectIcon()}
              <span>{option}</span>
            </span>
          </label>
        )
      })}
      {enquiryContent.allowsCustomInput &&
        (() => {
          const radioElement = (<input type="radio" name={inputName} value={"-q_custom"} />) as HTMLInputElement
          const inputElement = (
            <input type="text" placeholder={_localized("form.text-placeholder", context.options?.locale)} />
          ) as HTMLInputElement

          radioElement.onchange = () => {
            entryContent.value =
              radioElement.checked && inputElement.value.trim().length > 0 ? inputElement.value : null
            context.invalidateCanSend()
            if (radioElement.checked) {
              inputElement.focus()
            }
          }
          inputElement.oninput = () => {
            entryContent.value = inputElement.value.trim().length > 0 ? inputElement.value : null
            radioElement.checked = entryContent.value != null
            context.invalidateCanSend()
          }

          return (
            <label>
              {radioElement}
              <span>
                {renderSelectIcon()}
                {inputElement}
              </span>
            </label>
          )
        })()}
    </div>
  )
}

export function renderSelectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="#C2C2C2"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5 8.00012C14.5 11.59 11.5899 14.5001 8 14.5001C4.41015 14.5001 1.5 11.59 1.5 8.00012C1.5 4.41027 4.41015 1.50012 8 1.50012C11.5899 1.50012 14.5 4.41027 14.5 8.00012ZM16 8.00012C16 12.4184 12.4183 16.0001 8 16.0001C3.58172 16.0001 0 12.4184 0 8.00012C0 3.58184 3.58172 0.00012207 8 0.00012207C12.4183 0.00012207 16 3.58184 16 8.00012ZM8 12.0001C10.2091 12.0001 12 10.2093 12 8.00012C12 5.79098 10.2091 4.00012 8 4.00012C5.79086 4.00012 4 5.79098 4 8.00012C4 10.2093 5.79086 12.0001 8 12.0001Z"
        fill="#C2C2C2"
      />
    </svg>
  )
}
