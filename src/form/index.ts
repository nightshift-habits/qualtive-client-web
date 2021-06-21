import {
  Question,
  EntryContent,
  EntryReference,
  _Options,
  EntryContentScore,
  EntryContentText,
  EntryContentSelect,
  EntryContentMultiselect,
  EntryContentAttachments,
} from "../model"
import { _parseCollection } from "../collection"
import { getQuestion } from "../get"
import { _localized } from "../localized"
import { post } from "../post"
import { _renderInputTitle } from "./inputTitle"
import { _renderInputScore } from "./inputScore"
import { _renderInputText } from "./inputText"
import { _renderInputSelect } from "./inputSelect"
import { _renderInputMultiselect } from "./inputMultiselect"
import { _renderInputAttachments } from "./inputAttachment"
import { _constants } from "./constants"
import { _renderPreviewScore } from "./previewScore"
import { _renderPreviewText } from "./previewText"
import { _renderPreviewSelect } from "./previewSelect"
import { _renderPreviewMultiselect } from "./previewMultiselect"
import { _renderPreviewAttachments } from "./previewAttachments"

/**
 * Optional options to use when posting feedback using built in form-UI.
 */
export type FormOptions = _Options & {
  /**
   * Localized form title to show on top of the form. Default: `"Leave feedback"`.
   */
  title?: string

  /**
   * User who entered feedback. For example the logged in user on the site. Optional.
   */
  user?: {
    id?: string | number | null
    name?: string
    email?: string
  } | null

  /**
   * Custom attributes
   */
  customAttributes?: { [key: string]: string | number | boolean | null } | null

  /**
   * Optional link to customer support. If this property has a value a link the custom support will be displayed in the form. Default: `null`.
   */
  supportURL?: string

  /**
   * Option to override if dark appearance should be used or not. Default is auto.
   *
   * - auto: Dark mode is used if the user prefers dark mode.
   * - never: Dark mode will never be used.
   * - always: Dark mode will always be used.
   */
  darkMode?: "auto" | "never" | "always"

  /**
   * Option to disallow dismissal of the form by clicking escape on the keyboard. Default is false.
   */
  disallowKeyboardDismiss?: boolean

  /**
   * Optional function that is called when the form is dismissed. First parameter contains the reference sent entry or null if the form was cancelled.
   */
  onDismiss?: (entry: EntryReference | null) => void
}

/**
 * Reference to a presented form.
 */
export type Form = {
  /**
   * Dismisses the form.
   */
  dismiss: () => void
}

export type _InputRenderingContext = {
  containerId: string
  contentElement: HTMLElement
  tabIndex: number
  options: FormOptions | undefined
  invalidateCanSend: () => void
}
export type _PreviewRenderingContext = {
  currentResultElement: HTMLElement
  options: FormOptions | undefined
}

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/question-id`. Required.
 * @param options Optional options.
 * @returns Form. The presented form.
 */
export const present = (collection: string, options?: FormOptions): Form => {
  const style =
    '@font-face{font-family:Inter;font-weight:400;src:url(https://static.qualtive.io/fonts/Inter-Regular.woff)}@font-face{font-family:Inter;font-weight:500;src:url(https://static.qualtive.io/fonts/Inter-Medium.woff)}@font-face{font-family:Inter;font-weight:600;src:url(https://static.qualtive.io/fonts/Inter-SemiBold.woff)}#_q-container *{margin:0;padding:0;box-sizing:border-box;appearance:none;-webkit-appearance:none;box-sizing:border-box;font-family:Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;font-weight:400;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:transparent}#_q-container :not(textarea):not(#_q-container._q-error._q-successli:first-child):not(#_q-container._q-resultp):not(#_q-container._q-result){cursor:default;user-select:none;-moz-user-select:none;-webkit-user-select:none}#_q-container button{background:0 0;border:none;cursor:pointer!important}#_q-container button *{cursor:pointer!important}#_q-container ul{list-style:none}#_q-container button>*{vertical-align:middle}#_q-container button>svg{margin:0 5px 2px 0}#_q-no-click{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999997}#_q-container{width:100%;position:fixed;max-width:375px;max-height:100vh;overflow:auto;background:#fff;box-shadow:0 0 50px rgba(0,0,0,.4);left:50%;top:50%;transform:translate(-50%,-50%);transition:transform .25s,opacity .25s;z-index:99999998}#_q-container._q-out{transform:translate(-50%,-50%) scale(.9);opacity:0}#_q-container>div{padding:30px 50px 0}#_q-container ._q-cancel{margin:0 0 0 auto;display:block;transform:translate(20px,0)}#_q-container ._q-cancel:focus{outline:0;opacity:.7}#_q-container h2{font-size:14px;color:#333;margin:0 0 30px;line-height:20px}#_q-container h3{font-size:16px;font-weight:600;color:#333;margin:26px 0 20px}#_q-container p{font-size:14px;font-weight:600;line-height:24px;color:#333;margin:26px 0 10px}#_q-container ._q-score{margin:10px 0;display:table;width:100%}#_q-container ._q-score li{display:inline-block;display:table-cell}#_q-container ._q-score li button:focus{opacity:.6}#_q-container ._q-score li._q-selected button:focus{opacity:1}#_q-container ._q-score button:focus{outline:0}#_q-container ._q-score._q-smilies li._q-option{width:34px}#_q-container ._q-score._q-smilies li svg:first-child,#_q-container ._q-score._q-smilies li svg:first-child *{cursor:pointer!important}#_q-container ._q-score._q-smilies li button:focus svg:first-child,#_q-container ._q-score._q-smilies li button:hover svg:first-child,#_q-container ._q-score._q-smilies li._q-selected svg:first-child{display:none}#_q-container ._q-score._q-smilies li button:focus svg:last-child,#_q-container ._q-score._q-smilies li button:hover svg:last-child,#_q-container ._q-score._q-smilies li._q-selected svg:last-child{display:inline-block}#_q-container ._q-score._q-smilies li._q-0 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-0 svg:first-child:hover [fill="#4F4F4F"]{fill:#e33737}#_q-container ._q-score._q-smilies li._q-0 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-0 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#e33737}#_q-container ._q-score._q-smilies li._q-25 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-25 svg:first-child:hover [fill="#4F4F4F"]{fill:#ae563a}#_q-container ._q-score._q-smilies li._q-25 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-25 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#ae563a}#_q-container ._q-score._q-smilies li._q-50 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-50 svg:first-child:hover [fill="#4F4F4F"]{fill:#333}#_q-container ._q-score._q-smilies li._q-50 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-50 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#333}#_q-container ._q-score._q-smilies li._q-75 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-75 svg:first-child:hover [fill="#4F4F4F"]{fill:#f3be40}#_q-container ._q-score._q-smilies li._q-75 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-75 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#f3be40}#_q-container ._q-score._q-smilies li._q-100 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-100 svg:first-child:hover [fill="#4F4F4F"]{fill:#3ca53e}#_q-container ._q-score._q-smilies li._q-100 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-100 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#3ca53e}#_q-container ._q-score._q-smilies li svg:last-child{display:none}#_q-container ._q-score._q-nps li{width:20px}#_q-container ._q-score._q-nps li button,#_q-container ._q-score._q-nps li span{display:block;width:20px;height:24px;line-height:21px;text-align:center;border:1px solid #c7cacd;border-radius:6px;font-size:13px;font-weight:700;color:#000}#_q-container ._q-score._q-nps li span{width:19px}#_q-container ._q-score._q-nps li button:hover{border-color:#000;box-shadow:inset 0 0 0 1px #000}#_q-container ._q-score._q-nps li._q-selected button{box-shadow:none;border:none;color:#fff}#_q-container ._q-score._q-nps li._q-selected span{border-color:transparent;color:#fff}#_q-container ._q-score._q-nps li._q-selected._q-l0 button,#_q-container ._q-score._q-nps li._q-selected._q-l0 span{background:#e33737}#_q-container ._q-score._q-nps li._q-selected._q-l1 button,#_q-container ._q-score._q-nps li._q-selected._q-l1 span{background:#333}#_q-container ._q-score._q-nps li._q-selected._q-l2 button,#_q-container ._q-score._q-nps li._q-selected._q-l2 span{background:#ffb908}#_q-container ._q-score._q-nps li._q-selected._q-l3 button,#_q-container ._q-score._q-nps li._q-selected._q-l3 span{background:#2fa34b}#_q-container ._q-leading-trailing>span{color:#333;font-size:14px}#_q-container ._q-leading-trailing>span:first-child{float:right}#_q-container ._q-score._q-nps li:not(._q-selected) span{opacity:.3}#_q-container textarea{width:100%;resize:none;border:1px solid #333;border-radius:6px;padding:12px 12px;font-size:14px;font-weight:400;outline:0;height:100px;line-height:20px;color:#333}#_q-container textarea:active:not(:disabled),#_q-container textarea:focus:not(:disabled){border:2px solid #0b75b1;padding:11px 11px}#_q-container textarea::-webkit-input-placeholder{color:#333}#_q-container textarea:-moz-placeholder{color:#333}#_q-container textarea::-moz-placeholder{color:#333}#_q-container textarea:-ms-input-placeholder{color:#333}#_q-container textarea::placeholder{color:#333}#_q-container ._q-options{margin:10px 0 20px}#_q-container ._q-options button{display:table;width:100%;outline:0}#_q-container ._q-options button:not(:last-child){margin:0 0 10px}#_q-container ._q-options button span:first-child{display:table-cell;padding:0 14px 0 0}#_q-container ._q-options button span:first-child svg{position:relative;top:1px}#_q-container ._q-options button span:first-child svg path{fill:#c2c2c2}#_q-container ._q-options button._q-selected span:first-child svg path,#_q-container ._q-options button:active span:first-child svg path{fill:#000}#_q-container ._q-options button:focus span:first-child svg path{fill:#0b75b1}#_q-container ._q-options button span:last-child{display:table-cell;border:1px solid #c2c2c2;width:100%;text-align:left;font-size:14px;line-height:20px;padding:5px 15px}#_q-container ._q-options button._q-selected span:last-child,#_q-container ._q-options button:active span:last-child{color:#000;border-color:#000}#_q-container ._q-options button._q-selected span:last-child{box-shadow:inset 0 0 0 1px #000}#_q-container ._q-options button:focus span:last-child{color:#0b75b1;border-color:#0b75b1}#_q-container ._q-options button._q-selected:focus span:last-child{box-shadow:inset 0 0 0 1px #0b75b1}#_q-container ._q-attachments{margin:10px 0 20px;overflow:auto;white-space:nowrap}#_q-container ._q-attachments>*{vertical-align:top}#_q-container ._q-attachments label *{cursor:pointer!important}#_q-container ._q-attachments input{opacity:0;position:absolute;top:-500px}#_q-container ._q-attachments label rect{stroke:#333}#_q-container ._q-attachments label path{fill:#333}#_q-container ._q-attachments button{width:40px;height:40px;background-repeat:no-repeat;background-size:cover;text-align:right;border:1px solid #bdbdbd;margin:0 10px 0 0}#_q-container ._q-attachments button svg{margin:20px 0 0;position:relative;z-index:99999998;left:1px}#_q-container ._q-buttons{margin:30px 0;text-align:right}#_q-container._q-sent ._q-buttons{display:none}#_q-container ._q-buttons li{display:inline-block}#_q-container ._q-buttons li button{display:inline-block;font-weight:600;font-size:14px;line-height:20px;padding:8px 12px;border:2px solid transparent;border-radius:6px}#_q-container ._q-buttons li:first-child button{color:#eb5757;margin:0 10px 0 0}#_q-container ._q-buttons li:first-child button{color:#eb5757}#_q-container ._q-buttons li:first-child button:hover:not(:disabled){opacity:.7}#_q-container ._q-buttons li:first-child button:focus:not(:disabled){border-color:#eb5757;color:#eb5757;outline:0}#_q-container ._q-buttons li:first-child button:active:not(:disabled){opacity:.4}#_q-container ._q-buttons li:first-child button:active:focus:not(:disabled){border-color:#eb5757;color:#fff;background:#eb5757;opacity:1}#_q-container ._q-buttons li:last-child button{color:#333;height:40px;border-color:#333}#_q-container ._q-buttons li:last-child button:focus:not(:disabled),#_q-container ._q-buttons li:last-child button:hover:not(:disabled){border-color:#0b75b1;color:#0b75b1;outline:0}#_q-container ._q-buttons li:last-child button:focus:not(:disabled) [stroke="#333"],#_q-container ._q-buttons li:last-child button:hover:not(:disabled) [stroke="#333"]{stroke:#0b75b1}#_q-container ._q-buttons li:last-child button:active:not(:disabled){border-color:#1a6e9d;color:#fff;background:#1a6e9d}#_q-container ._q-buttons li:last-child button:active:not(:disabled) [stroke="#333"]{stroke:#fff}#_q-container ._q-buttons li button:disabled{opacity:.3;cursor:default!important}#_q-container ._q-buttons li button:disabled *{cursor:default!important}#_q-container ._q-success{display:none;width:100%;margin:30px 0}#_q-container._q-error ._q-success,#_q-container._q-sent ._q-success{display:table}#_q-container ._q-success li{display:table-cell}#_q-container ._q-success li:first-child{text-align:left;color:#219653;font-weight:600;font-size:14px;vertical-align:middle}#_q-container ._q-success li:first-child svg{margin:1px 6px 0 0}#_q-container ._q-success li:last-child{text-align:right}#_q-container ._q-success li:last-child button{text-align:right;color:#000;border:2px solid #000;border-radius:6px;font-weight:600;font-size:14px;padding:8px 16px;line-height:20px;height:40px}#_q-container ._q-success li:last-child button:focus:not(:disabled),#_q-container ._q-success li:last-child button:hover:not(:disabled){border-color:#0b75b1;color:#0b75b1;outline:0}#_q-container ._q-success li:last-child button:focus:not(:disabled) [stroke="#000"],#_q-container ._q-success li:last-child button:hover:not(:disabled) [stroke="#000"]{stroke:#0b75b1}#_q-container ._q-success li:last-child button:active:not(:disabled){color:#fff;background:#1a6e9d;border-color:#1a6e9d}#_q-container._q-error:not(._q-sent) ._q-success li:last-child{display:none}#_q-container ._q-success li:last-child button:active:not(:disabled) [stroke="#000"]{stroke:#fff}#_q-container._q-error ._q-success li:first-child svg{display:none}#_q-container._q-error ._q-success li:first-child{color:#e33737}#_q-container ._q-support-link{background:#fcf1d1;font-size:12px;text-align:right;padding:20px 30px 20px 10px;line-height:20px}#_q-container ._q-support-link a:focus{outline:0;text-decoration:underline}#_q-container a{text-decoration:none;font-weight:500;cursor:pointer!important}#_q-container a:link,#_q-container a:visited{color:#0b75b1}#_q-container a:hover{text-decoration:underline}#_q-container._q-sent ._q-attachments,#_q-container._q-sent ._q-leading-trailing,#_q-container._q-sent ._q-options,#_q-container._q-sent ._q-score,#_q-container._q-sent h3,#_q-container._q-sent p:not(._q-after),#_q-container._q-sent textarea{display:none}#_q-container ._q-result ._q-leading-trailing{display:block}#_q-container ._q-result{padding:0 0 0 16px;border-left:1px dashed #979797}#_q-container ._q-result ._q-score{display:table}#_q-container ._q-result ._q-scored{display:block;margin:0 0 12px}#_q-container ._q-result p{font-weight:400;font-size:16px;margin:0 0 12px}#_q-container ._q-result ._q-option{margin:0 0 10px;font-size:16px}#_q-container ._q-result ._q-option svg{vertical-align:middle;position:relative;top:-2px;margin:0 8px 0 0}#_q-container ._q-result ._q-option:first-child{padding-top:2px}#_q-container ._q-attached{white-space:nowrap;overflow:auto;margin:10px 0}#_q-container ._q-attached img{width:40px;height:40px;object-fit:cover;border:1px solid #bdbdbd;margin:0 5px 0 0}@media only screen and (max-width:550px),(max-height:550px){#_q-container{position:absolute;height:auto;overflow:auto;max-height:none;margin:20px 0 0;top:0;transform:translate(-50%,0)}#_q-container._q-out{transform:translate(-50%,0) scale(.9)}#_q-container textarea{font-size:16px}}@media only screen and (max-width:460px){#_q-container{max-width:none}}'
  const styleDarkMode =
    '#_q-container{background:#111}#_q-container ._q-cancel [stroke="#000"]{stroke:#fff}#_q-container h2{color:#fff}#_q-container h3,#_q-container p{color:#fff}#_q-container ._q-score svg:first-child [fill="#4F4F4F"]{fill:#aaa}#_q-container ._q-score svg:first-child [stroke="#4F4F4F"]{stroke:#aaa}#_q-container ._q-score li._q-50 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [fill="#4F4F4F"]{fill:#eee}#_q-container ._q-score li._q-50 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#eee}#_q-container ._q-score li._q-50 svg:last-child:hover [fill="#4F4F4F"]{fill:#eee}#_q-container ._q-score li._q-50 svg:last-child:hover [stroke="#4F4F4F"]{stroke:#eee}#_q-container ._q-score._q-nps li button,#_q-container ._q-score._q-nps li span{border-color:1px solid #eee;color:#fff}#_q-container ._q-score._q-nps li button:hover{border-color:#fff;box-shadow:inset 0 0 0 1px #fff}#_q-container ._q-score._q-nps li._q-selected._q-l1 button,#_q-container ._q-score._q-nps li._q-selected._q-l1 span{background:#ccc}#_q-container ._q-leading-trailing>span{color:#fff}#_q-container textarea{background:#000;border-color:#aaa;color:#fff}#_q-container textarea:active:not(:disabled),#_q-container textarea:focus:not(:disabled){border:2px solid #1ac8ff;padding:11px 11px}#_q-container textarea::-webkit-input-placeholder{color:#ddd}#_q-container textarea:-moz-placeholder{color:#ddd}#_q-container textarea::-moz-placeholder{color:#ddd}#_q-container textarea:-ms-input-placeholder{color:#ddd}#_q-container textarea::placeholder{color:#ddd}#_q-container ._q-options{margin:0 0 20px}#_q-container ._q-options button span:first-child svg path{fill:#ddd}#_q-container ._q-options button._q-selected span:first-child svg path,#_q-container ._q-options button:active span:first-child svg path{fill:#fff}#_q-container ._q-options button:focus span:first-child svg path{fill:#1ac8ff}#_q-container ._q-options button span:last-child{border-color:#ddd;color:#fff}#_q-container ._q-options button._q-selected span:last-child,#_q-container ._q-options button:active span:last-child{color:#fff;border-color:#fff}#_q-container ._q-options button._q-selected span:last-child{box-shadow:inset 0 0 0 1px #fff}#_q-container ._q-options button:focus span:last-child{color:#1ac8ff;border-color:#1ac8ff}#_q-container ._q-options button._q-selected:focus span:last-child{box-shadow:inset 0 0 0 1px #1ac8ff}#_q-container ._q-attachments label rect{stroke:#ddd}#_q-container ._q-attachments label path{fill:#ddd}#_q-container ._q-buttons li:last-child button{color:#ddd;border-color:#ddd}#_q-container ._q-buttons li:last-child button [stroke="#333"]{stroke:#ddd}#_q-container ._q-buttons li button:disabled{color:#ddd}#_q-container ._q-success{display:none;width:100%;margin:30px 0}#_q-container ._q-success li:last-child button{color:#ddd;border-color:#ddd}#_q-container ._q-success li:last-child button [stroke="#000"]{stroke:#ddd}#_q-container ._q-success li:last-child button:active:not(:disabled){color:#fff;background:#1ac8ff;border-color:#1ac8ff}#_q-container ._q-success li:last-child button:active:not(:disabled) [stroke="#000"]{stroke:#fff}#_q-container ._q-support-link{background:#2e2d2a}#_q-container ._q-result{border-left-color:#ddd}#_q-container ._q-result ._q-option{color:#fff}#_q-container ._q-result ._q-option svg path{fill:#fff}'

  const [containerId] = _parseCollection(collection)

  let entryReference: EntryReference | null

  let content: EntryContent[] = []

  const styleElement = document.createElement("style")
  let computedStyle = style
  if (!options?.darkMode || options.darkMode == "auto") {
    computedStyle += "@media (prefers-color-scheme:dark){" + styleDarkMode + "}"
  } else if (options?.darkMode == "always") {
    computedStyle += styleDarkMode
  }
  styleElement.innerHTML = computedStyle
  document.head.appendChild(styleElement)

  const noClickElement = document.createElement("div")
  noClickElement.setAttribute("id", "_q-no-click")

  const containerElement = document.createElement("div")
  containerElement.setAttribute("id", "_q-container")
  containerElement.setAttribute("class", "_q-out")
  containerElement.style.minHeight = "498px"

  const contentElement = document.createElement("div")
  containerElement.appendChild(contentElement)

  const closeElement = document.createElement("button")
  closeElement.setAttribute("class", "_q-cancel")
  closeElement.setAttribute("title", _localized("form.close", options?.locale))
  closeElement.setAttribute("tabindex", "9001")
  closeElement.innerHTML = _constants.iconClose
  contentElement.appendChild(closeElement)

  const titleElement = document.createElement("h2")
  titleElement.textContent = options?.title || _localized("form.title", options?.locale)
  contentElement.appendChild(titleElement)

  const buttonsElement = document.createElement("ul")
  buttonsElement.setAttribute("class", "_q-buttons")

  const cancelElement = document.createElement("li")
  buttonsElement.appendChild(cancelElement)

  const cancelButtonElement = document.createElement("button")
  cancelButtonElement.textContent = _localized("form.cancel", options?.locale)
  cancelButtonElement.setAttribute("tabindex", "9202")
  cancelElement.appendChild(cancelButtonElement)

  const sendElement = document.createElement("li")
  buttonsElement.appendChild(sendElement)

  const sendButtonElement = document.createElement("button")
  sendButtonElement.setAttribute("tabindex", "9203")
  sendButtonElement.disabled = true
  sendButtonElement.innerHTML = _constants.iconSend + _localized("form.send", options?.locale)
  sendElement.appendChild(sendButtonElement)

  const successElement = document.createElement("ul")
  successElement.setAttribute("class", "_q-success")

  const successTextElement = document.createElement("li")
  successTextElement.textContent = _localized("form.sending", options?.locale)
  successElement.appendChild(successTextElement)

  const successCloseElement = document.createElement("li")
  successElement.appendChild(successCloseElement)

  const successButtonElement = document.createElement("button")
  sendButtonElement.setAttribute("tabindex", "9204")
  successButtonElement.innerHTML = _constants.iconMessage + _localized("form.close", options?.locale)
  successCloseElement.appendChild(successButtonElement)

  document.body.appendChild(noClickElement)
  document.body.appendChild(containerElement)

  let resultElements: HTMLElement[] = []

  // Handle keyboard events

  const dismissByKeyEvent = (event: KeyboardEvent): boolean | undefined => {
    if (
      (event.key == "Escape" || event.key == "Esc" || event.keyCode == 27) &&
      document.activeElement?.tagName != "TEXTAREA"
    ) {
      event.preventDefault()
      dismiss()
      return false
    }
  }

  if (options?.disallowKeyboardDismiss != true) {
    window.addEventListener("keydown", dismissByKeyEvent)
  }

  // Interaction

  const canSend = (): boolean =>
    content.some((x) => {
      switch (x.type) {
        case "title":
          return false
        case "score":
          return typeof x.value == "number"
        case "text":
        case "select":
          return typeof x.value == "string"
        case "multiselect":
        case "attachments":
          return x.values.length > 0
        default:
          return false
      }
    })

  const invalidateCanSend = (): void => {
    sendButtonElement.disabled = !canSend()
  }

  const dismiss = (): void => {
    if (options?.disallowKeyboardDismiss != true) {
      window.removeEventListener("keydown", dismissByKeyEvent)
    }

    noClickElement.parentElement?.removeChild(noClickElement)
    containerElement.className += " _q-out"

    setTimeout(() => {
      containerElement.parentElement?.removeChild(containerElement)
      styleElement.parentElement?.removeChild(styleElement)
    }, 500)

    options?.onDismiss?.(entryReference)
  }
  const send = (): void => {
    containerElement.className.replace("_q-error", "")

    post(collection, {
      content: content.map((x) => {
        switch (x.type) {
          case "attachments":
            return {
              type: "attachments",
              values: x.values.map((y) => ({
                id: y.id,
              })),
            }
          default:
            return x
        }
      }),
      user: options?.user,
      customAttributes: options?.customAttributes,
    })
      .then((newEntryReference) => {
        entryReference = newEntryReference

        containerElement.className += " _q-sent"

        successTextElement.innerHTML = _constants.iconSuccess + _localized("form.sent", options?.locale)

        let currentResultElement: HTMLDivElement | null
        content.forEach((content) => {
          switch (content.type) {
            case "title": {
              const pElement = document.createElement("p")
              pElement.className = "_q-after"
              pElement.innerText = content.text
              contentElement.appendChild(pElement)
              resultElements.push(pElement)
              break
            }
            case "score":
              if (content.value == null) return
              break
            case "text":
            case "select":
              if (content.value == null) return
              break
            case "multiselect":
            case "attachments":
              if (content.values.length == 0) return
              break
          }

          if (!currentResultElement || content.type == "title") {
            currentResultElement = document.createElement("div")
            currentResultElement.className = "_q-result"
            contentElement.appendChild(currentResultElement)
            resultElements.push(currentResultElement)
          }

          const context: _PreviewRenderingContext = {
            currentResultElement,
            options,
          }

          switch (content.type) {
            case "title":
              break
            case "score":
              _renderPreviewScore(context, content)
              break
            case "text":
              _renderPreviewText(context, content)
              break
            case "select":
              _renderPreviewSelect(context, content)
              break
            case "multiselect":
              _renderPreviewMultiselect(context, content)
              break
            case "attachments":
              _renderPreviewAttachments(context, content)
              break
          }
        })

        contentElement.removeChild(successElement)
        contentElement.removeChild(buttonsElement)
        contentElement.appendChild(successElement)
        contentElement.appendChild(buttonsElement)
      })
      .catch((error) => {
        containerElement.className = containerElement.className = " _q-error"
        successTextElement.textContent = _localized("form.error", options?.locale)
        console.error("Error sending Qualtive entry", error)

        resultElements.forEach((x) => contentElement.removeChild(x))
        resultElements = []
      })
  }

  cancelButtonElement.onclick = dismiss
  successButtonElement.onclick = dismiss
  sendButtonElement.onclick = send
  closeElement.onclick = dismiss

  // Question content

  let question: Question | null
  let hasRenderedQuestion = false

  const renderQuestionContent = () => {
    hasRenderedQuestion = true

    if (question) {
      const renderingContext: _InputRenderingContext = {
        containerId,
        contentElement,
        options,
        tabIndex: 9100,
        invalidateCanSend,
      }

      const mainTitleElement = document.createElement("p")
      mainTitleElement.textContent = question.name
      contentElement.appendChild(mainTitleElement)

      question.content.forEach((questionContent, contentIndex) => {
        switch (questionContent.type) {
          case "title":
            _renderInputTitle(renderingContext, questionContent)
            break
          case "score":
            _renderInputScore(renderingContext, questionContent, content[contentIndex] as EntryContentScore)
            break
          case "text":
            _renderInputText(renderingContext, questionContent, content[contentIndex] as EntryContentText)
            break
          case "select":
            _renderInputSelect(renderingContext, questionContent, content[contentIndex] as EntryContentSelect)
            break
          case "multiselect":
            _renderInputMultiselect(renderingContext, questionContent, content[contentIndex] as EntryContentMultiselect)
            break
          case "attachments":
            _renderInputAttachments(renderingContext, questionContent, content[contentIndex] as EntryContentAttachments)
        }
      })
    }

    contentElement.appendChild(successElement)
    contentElement.appendChild(buttonsElement)

    if (options?.supportURL) {
      const footerElement = document.createElement("div")
      footerElement.setAttribute("class", "_q-support-link")
      containerElement.appendChild(footerElement)

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", options.supportURL)
      linkElement.setAttribute("target", "_blank")
      linkElement.setAttribute("rel", "noopener noreferrer")
      linkElement.setAttribute("tabindex", "9205")
      linkElement.textContent = _localized("form.support", options.locale) + " ->"
      footerElement.appendChild(linkElement)
    }

    containerElement.style.minHeight = "auto"
  }

  // Animate in

  let canRenderQuestionDirectly = true // If we fetch the question fast we could show the form directly.
  let hasAnimateIn = false

  const animateInIfNeeded = () => {
    if (hasAnimateIn) return
    hasAnimateIn = true
    canRenderQuestionDirectly = false

    setTimeout(() => {
      containerElement.className = containerElement.className.replace("_q-out", "")
      closeElement.focus()
    }, 1)

    if (!hasRenderedQuestion) {
      setTimeout(() => {
        if (question) {
          renderQuestionContent()
        } else {
          canRenderQuestionDirectly = true
        }
      }, 300)
    }
  }

  const initialAnimateInTimeout = setTimeout(animateInIfNeeded, 150)

  // Get question and display content

  getQuestion(collection, options)
    .then((_question) => {
      question = _question
      content = _question.content
        .map((x): EntryContent | undefined => {
          switch (x.type) {
            case "title":
              return { type: "title", text: x.text }
            case "score":
              return {
                type: "score",
                value: null,
                scoreType: x.scoreType,
                leadingText: x.leadingText,
                trailingText: x.trailingText,
              }
            case "text":
              return { type: "text", value: null }
            case "select":
              return { type: "select", value: null }
            case "multiselect":
              return { type: "multiselect", values: [] }
            case "attachments":
              return { type: "attachments", values: [] }
          }
        })
        .filter((x): x is EntryContent => !!x)
    })
    .catch(() => {
      successTextElement.textContent = _localized("form.error", options?.locale)
    })
    .finally(() => {
      if (canRenderQuestionDirectly) {
        clearTimeout(initialAnimateInTimeout)
        renderQuestionContent()
        setTimeout(animateInIfNeeded, 1)
      }
    })

  return {
    dismiss,
  }
}
