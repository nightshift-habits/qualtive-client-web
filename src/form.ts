import {
  Question,
  EntryContent,
  EntryReference,
  _Options,
  EntryContentScore,
  EntryContentText,
  EntryContentSelect,
  QuestionContentMultiselect,
  QuestionContentSelect,
  EntryContentMultiselect,
  EntryContentAttachments,
  AttachmentContentType,
} from "./model"
import { parseCollection } from "./private"
import { getQuestion } from "./get"
import { localized } from "./localized"
import { post } from "./post"
import { uploadAttachment } from "./attachment"

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

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/question-id`. Required.
 * @param options Optional options.
 * @returns Form. The presented form.
 */
export const present = (collection: string, options?: FormOptions): Form => {
  const scoresSmilies5 = [0, 25, 50, 75, 100]
  const scoresSmilies3 = [0, 50, 100]
  const scoresNPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  const style =
    '@font-face{font-family:Inter;font-weight:400;src:url(https://static.qualtive.io/fonts/Inter-Regular.woff)}@font-face{font-family:Inter;font-weight:500;src:url(https://static.qualtive.io/fonts/Inter-Medium.woff)}@font-face{font-family:Inter;font-weight:600;src:url(https://static.qualtive.io/fonts/Inter-SemiBold.woff)}#_q-container *{margin:0;padding:0;box-sizing:border-box;appearance:none;-webkit-appearance:none;box-sizing:border-box;font-family:Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;font-weight:400;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:transparent}#_q-container :not(textarea):not(#_q-container._q-error._q-successli:first-child):not(#_q-container._q-resultp):not(#_q-container._q-result){cursor:default;user-select:none;-moz-user-select:none;-webkit-user-select:none}#_q-container button{background:0 0;border:none;cursor:pointer!important}#_q-container button *{cursor:pointer!important}#_q-container ul{list-style:none}#_q-container button>*{vertical-align:middle}#_q-container button>svg{margin:0 5px 2px 0}#_q-no-click{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999997}#_q-container{width:100%;position:fixed;max-width:375px;max-height:100vh;overflow:auto;background:#fff;box-shadow:0 0 50px rgba(0,0,0,.4);left:50%;top:50%;transform:translate(-50%,-50%);transition:transform .25s,opacity .25s;z-index:99999998}#_q-container._q-out{transform:translate(-50%,-50%) scale(.9);opacity:0}#_q-container>div{padding:30px 50px 0}#_q-container ._q-cancel{margin:0 0 0 auto;display:block;transform:translate(20px,0)}#_q-container ._q-cancel:focus{outline:0;opacity:.7}#_q-container h2{font-size:14px;color:#333;margin:0 0 30px;line-height:20px}#_q-container h3{font-size:16px;font-weight:600;color:#333;margin:26px 0 20px}#_q-container p{font-size:14px;font-weight:600;line-height:24px;color:#333;margin:26px 0 10px}#_q-container ._q-score{margin:10px 0;display:table;width:100%}#_q-container ._q-score li{display:inline-block;display:table-cell}#_q-container ._q-score li button:focus{opacity:.6}#_q-container ._q-score li._q-selected button:focus{opacity:1}#_q-container ._q-score button:focus{outline:0}#_q-container ._q-score._q-smilies li._q-option{width:34px}#_q-container ._q-score._q-smilies li svg:first-child,#_q-container ._q-score._q-smilies li svg:first-child *{cursor:pointer!important}#_q-container ._q-score._q-smilies li button:focus svg:first-child,#_q-container ._q-score._q-smilies li button:hover svg:first-child,#_q-container ._q-score._q-smilies li._q-selected svg:first-child{display:none}#_q-container ._q-score._q-smilies li button:focus svg:last-child,#_q-container ._q-score._q-smilies li button:hover svg:last-child,#_q-container ._q-score._q-smilies li._q-selected svg:last-child{display:inline-block}#_q-container ._q-score._q-smilies li._q-0 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-0 svg:first-child:hover [fill="#4F4F4F"]{fill:#e33737}#_q-container ._q-score._q-smilies li._q-0 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-0 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#e33737}#_q-container ._q-score._q-smilies li._q-25 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-25 svg:first-child:hover [fill="#4F4F4F"]{fill:#ae563a}#_q-container ._q-score._q-smilies li._q-25 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-25 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#ae563a}#_q-container ._q-score._q-smilies li._q-50 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-50 svg:first-child:hover [fill="#4F4F4F"]{fill:#333}#_q-container ._q-score._q-smilies li._q-50 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-50 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#333}#_q-container ._q-score._q-smilies li._q-75 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-75 svg:first-child:hover [fill="#4F4F4F"]{fill:#f3be40}#_q-container ._q-score._q-smilies li._q-75 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-75 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#f3be40}#_q-container ._q-score._q-smilies li._q-100 button:focus [fill="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-100 svg:first-child:hover [fill="#4F4F4F"]{fill:#3ca53e}#_q-container ._q-score._q-smilies li._q-100 button:focus [stroke="#4F4F4F"],#_q-container ._q-score._q-smilies li._q-100 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#3ca53e}#_q-container ._q-score._q-smilies li svg:last-child{display:none}#_q-container ._q-score._q-nps li{width:20px}#_q-container ._q-score._q-nps li button,#_q-container ._q-score._q-nps li span{display:block;width:20px;height:24px;line-height:21px;text-align:center;border:1px solid #c7cacd;border-radius:6px;font-size:13px;font-weight:700;color:#000}#_q-container ._q-score._q-nps li span{width:19px}#_q-container ._q-score._q-nps li button:hover{border-color:#000;box-shadow:inset 0 0 0 1px #000}#_q-container ._q-score._q-nps li._q-selected button{box-shadow:none;border:none;color:#fff}#_q-container ._q-score._q-nps li._q-selected span{border-color:transparent;color:#fff}#_q-container ._q-score._q-nps li._q-selected._q-l0 button,#_q-container ._q-score._q-nps li._q-selected._q-l0 span{background:#e33737}#_q-container ._q-score._q-nps li._q-selected._q-l1 button,#_q-container ._q-score._q-nps li._q-selected._q-l1 span{background:#333}#_q-container ._q-score._q-nps li._q-selected._q-l2 button,#_q-container ._q-score._q-nps li._q-selected._q-l2 span{background:#ffb908}#_q-container ._q-score._q-nps li._q-selected._q-l3 button,#_q-container ._q-score._q-nps li._q-selected._q-l3 span{background:#2fa34b}#_q-container ._q-leading-trailing>span{color:#333;font-size:14px}#_q-container ._q-leading-trailing>span:first-child{float:right}#_q-container ._q-score._q-nps li:not(._q-selected) span{opacity:.3}#_q-container textarea{width:100%;resize:none;border:1px solid #333;border-radius:6px;padding:12px 12px;font-size:14px;font-weight:400;outline:0;height:100px;line-height:20px;color:#333}#_q-container textarea:active:not(:disabled),#_q-container textarea:focus:not(:disabled){border:2px solid #0b75b1;padding:11px 11px}#_q-container textarea::-webkit-input-placeholder{color:#333}#_q-container textarea:-moz-placeholder{color:#333}#_q-container textarea::-moz-placeholder{color:#333}#_q-container textarea:-ms-input-placeholder{color:#333}#_q-container textarea::placeholder{color:#333}#_q-container ._q-options{margin:10px 0 20px}#_q-container ._q-options button{display:table;width:100%;outline:0}#_q-container ._q-options button:not(:last-child){margin:0 0 10px}#_q-container ._q-options button span:first-child{display:table-cell;padding:0 14px 0 0}#_q-container ._q-options button span:first-child svg{position:relative;top:1px}#_q-container ._q-options button span:first-child svg path{fill:#c2c2c2}#_q-container ._q-options button._q-selected span:first-child svg path,#_q-container ._q-options button:active span:first-child svg path{fill:#000}#_q-container ._q-options button:focus span:first-child svg path{fill:#0b75b1}#_q-container ._q-options button span:last-child{display:table-cell;border:1px solid #c2c2c2;width:100%;text-align:left;font-size:14px;line-height:20px;padding:5px 15px}#_q-container ._q-options button._q-selected span:last-child,#_q-container ._q-options button:active span:last-child{color:#000;border-color:#000}#_q-container ._q-options button._q-selected span:last-child{box-shadow:inset 0 0 0 1px #000}#_q-container ._q-options button:focus span:last-child{color:#0b75b1;border-color:#0b75b1}#_q-container ._q-options button._q-selected:focus span:last-child{box-shadow:inset 0 0 0 1px #0b75b1}#_q-container ._q-attachments{margin:10px 0 20px;overflow:auto;white-space:nowrap}#_q-container ._q-attachments>*{vertical-align:top}#_q-container ._q-attachments label *{cursor:pointer!important}#_q-container ._q-attachments input{opacity:0;position:absolute;top:-500px}#_q-container ._q-attachments label rect{stroke:#333}#_q-container ._q-attachments label path{fill:#333}#_q-container ._q-attachments button{width:40px;height:40px;background-repeat:no-repeat;background-size:cover;text-align:right;border:1px solid #bdbdbd;margin:0 10px 0 0}#_q-container ._q-attachments button svg{margin:20px 0 0;position:relative;z-index:99999998;left:1px}#_q-container ._q-buttons{margin:30px 0;text-align:right}#_q-container._q-sent ._q-buttons{display:none}#_q-container ._q-buttons li{display:inline-block}#_q-container ._q-buttons li button{display:inline-block;font-weight:600;font-size:14px;line-height:20px;padding:8px 12px;border:2px solid transparent;border-radius:6px}#_q-container ._q-buttons li:first-child button{color:#eb5757;margin:0 10px 0 0}#_q-container ._q-buttons li:first-child button{color:#eb5757}#_q-container ._q-buttons li:first-child button:hover:not(:disabled){opacity:.7}#_q-container ._q-buttons li:first-child button:focus:not(:disabled){border-color:#eb5757;color:#eb5757;outline:0}#_q-container ._q-buttons li:first-child button:active:not(:disabled){opacity:.4}#_q-container ._q-buttons li:first-child button:active:focus:not(:disabled){border-color:#eb5757;color:#fff;background:#eb5757;opacity:1}#_q-container ._q-buttons li:last-child button{color:#333;height:40px;border-color:#333}#_q-container ._q-buttons li:last-child button:focus:not(:disabled),#_q-container ._q-buttons li:last-child button:hover:not(:disabled){border-color:#0b75b1;color:#0b75b1;outline:0}#_q-container ._q-buttons li:last-child button:focus:not(:disabled) [stroke="#333"],#_q-container ._q-buttons li:last-child button:hover:not(:disabled) [stroke="#333"]{stroke:#0b75b1}#_q-container ._q-buttons li:last-child button:active:not(:disabled){border-color:#1a6e9d;color:#fff;background:#1a6e9d}#_q-container ._q-buttons li:last-child button:active:not(:disabled) [stroke="#333"]{stroke:#fff}#_q-container ._q-buttons li button:disabled{opacity:.3;cursor:default!important}#_q-container ._q-buttons li button:disabled *{cursor:default!important}#_q-container ._q-success{display:none;width:100%;margin:30px 0}#_q-container._q-error ._q-success,#_q-container._q-sent ._q-success{display:table}#_q-container ._q-success li{display:table-cell}#_q-container ._q-success li:first-child{text-align:left;color:#219653;font-weight:600;font-size:14px;vertical-align:middle}#_q-container ._q-success li:first-child svg{margin:1px 6px 0 0}#_q-container ._q-success li:last-child{text-align:right}#_q-container ._q-success li:last-child button{text-align:right;color:#000;border:2px solid #000;border-radius:6px;font-weight:600;font-size:14px;padding:8px 16px;line-height:20px;height:40px}#_q-container ._q-success li:last-child button:focus:not(:disabled),#_q-container ._q-success li:last-child button:hover:not(:disabled){border-color:#0b75b1;color:#0b75b1;outline:0}#_q-container ._q-success li:last-child button:focus:not(:disabled) [stroke="#000"],#_q-container ._q-success li:last-child button:hover:not(:disabled) [stroke="#000"]{stroke:#0b75b1}#_q-container ._q-success li:last-child button:active:not(:disabled){color:#fff;background:#1a6e9d;border-color:#1a6e9d}#_q-container._q-error:not(._q-sent) ._q-success li:last-child{display:none}#_q-container ._q-success li:last-child button:active:not(:disabled) [stroke="#000"]{stroke:#fff}#_q-container._q-error ._q-success li:first-child svg{display:none}#_q-container._q-error ._q-success li:first-child{color:#e33737}#_q-container ._q-support-link{background:#fcf1d1;font-size:12px;text-align:right;padding:20px 30px 20px 10px;line-height:20px}#_q-container ._q-support-link a:focus{outline:0;text-decoration:underline}#_q-container a{text-decoration:none;font-weight:500;cursor:pointer!important}#_q-container a:link,#_q-container a:visited{color:#0b75b1}#_q-container a:hover{text-decoration:underline}#_q-container._q-sent ._q-attachments,#_q-container._q-sent ._q-leading-trailing,#_q-container._q-sent ._q-options,#_q-container._q-sent ._q-score,#_q-container._q-sent h3,#_q-container._q-sent p:not(._q-after),#_q-container._q-sent textarea{display:none}#_q-container ._q-result ._q-leading-trailing{display:block}#_q-container ._q-result{padding:0 0 0 16px;border-left:1px dashed #979797}#_q-container ._q-result ._q-score{display:table}#_q-container ._q-result ._q-scored{display:block;margin:0 0 12px}#_q-container ._q-result p{font-weight:400;font-size:16px;margin:0 0 12px}#_q-container ._q-result ._q-option{margin:0 0 10px;font-size:16px}#_q-container ._q-result ._q-option svg{vertical-align:middle;position:relative;top:-2px;margin:0 8px 0 0}#_q-container ._q-result ._q-option:first-child{padding-top:2px}#_q-container ._q-attached{white-space:nowrap;overflow:auto;margin:10px 0}#_q-container ._q-attached img{width:40px;height:40px;object-fit:cover;border:1px solid #bdbdbd;margin:0 5px 0 0}@media only screen and (max-width:550px),(max-height:550px){#_q-container{position:absolute;height:auto;overflow:auto;max-height:none;margin:20px 0 0;top:0;transform:translate(-50%,0)}#_q-container._q-out{transform:translate(-50%,0) scale(.9)}#_q-container textarea{font-size:16px}}@media only screen and (max-width:460px){#_q-container{max-width:none}}'
  const styleDarkMode =
    '#_q-container{background:#111}#_q-container ._q-cancel [stroke="#000"]{stroke:#fff}#_q-container h2{color:#fff}#_q-container h3,#_q-container p{color:#fff}#_q-container ._q-score svg:first-child [fill="#4F4F4F"]{fill:#aaa}#_q-container ._q-score svg:first-child [stroke="#4F4F4F"]{stroke:#aaa}#_q-container ._q-score li._q-50 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [fill="#4F4F4F"]{fill:#eee}#_q-container ._q-score li._q-50 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#eee}#_q-container ._q-score li._q-50 svg:last-child:hover [fill="#4F4F4F"]{fill:#eee}#_q-container ._q-score li._q-50 svg:last-child:hover [stroke="#4F4F4F"]{stroke:#eee}#_q-container ._q-score._q-nps li button,#_q-container ._q-score._q-nps li span{border-color:1px solid #eee;color:#fff}#_q-container ._q-score._q-nps li button:hover{border-color:#fff;box-shadow:inset 0 0 0 1px #fff}#_q-container ._q-score._q-nps li._q-selected._q-l1 button,#_q-container ._q-score._q-nps li._q-selected._q-l1 span{background:#ccc}#_q-container ._q-leading-trailing>span{color:#fff}#_q-container textarea{background:#000;border-color:#aaa;color:#fff}#_q-container textarea:active:not(:disabled),#_q-container textarea:focus:not(:disabled){border:2px solid #1ac8ff;padding:11px 11px}#_q-container textarea::-webkit-input-placeholder{color:#ddd}#_q-container textarea:-moz-placeholder{color:#ddd}#_q-container textarea::-moz-placeholder{color:#ddd}#_q-container textarea:-ms-input-placeholder{color:#ddd}#_q-container textarea::placeholder{color:#ddd}#_q-container ._q-options{margin:0 0 20px}#_q-container ._q-options button span:first-child svg path{fill:#ddd}#_q-container ._q-options button._q-selected span:first-child svg path,#_q-container ._q-options button:active span:first-child svg path{fill:#fff}#_q-container ._q-options button:focus span:first-child svg path{fill:#1ac8ff}#_q-container ._q-options button span:last-child{border-color:#ddd;color:#fff}#_q-container ._q-options button._q-selected span:last-child,#_q-container ._q-options button:active span:last-child{color:#fff;border-color:#fff}#_q-container ._q-options button._q-selected span:last-child{box-shadow:inset 0 0 0 1px #fff}#_q-container ._q-options button:focus span:last-child{color:#1ac8ff;border-color:#1ac8ff}#_q-container ._q-options button._q-selected:focus span:last-child{box-shadow:inset 0 0 0 1px #1ac8ff}#_q-container ._q-attachments label rect{stroke:#ddd}#_q-container ._q-attachments label path{fill:#ddd}#_q-container ._q-buttons li:last-child button{color:#ddd;border-color:#ddd}#_q-container ._q-buttons li:last-child button [stroke="#333"]{stroke:#ddd}#_q-container ._q-buttons li button:disabled{color:#ddd}#_q-container ._q-success{display:none;width:100%;margin:30px 0}#_q-container ._q-success li:last-child button{color:#ddd;border-color:#ddd}#_q-container ._q-success li:last-child button [stroke="#000"]{stroke:#ddd}#_q-container ._q-success li:last-child button:active:not(:disabled){color:#fff;background:#1ac8ff;border-color:#1ac8ff}#_q-container ._q-success li:last-child button:active:not(:disabled) [stroke="#000"]{stroke:#fff}#_q-container ._q-support-link{background:#2e2d2a}#_q-container ._q-result{border-left-color:#ddd}#_q-container ._q-result ._q-option{color:#fff}#_q-container ._q-result ._q-option svg path{fill:#fff}'

  const iconScore0 =
    '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect x="0.5" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M13.3811 16.1842C13.3811 14.9617 12.3862 13.9668 11.1637 13.9668C9.94116 13.9668 8.94629 14.9617 8.94629 16.1842C8.94629 17.4067 9.94116 18.4016 11.1637 18.4016C12.3862 18.4016 13.3811 17.4067 13.3811 16.1842ZM10.4246 16.1842C10.4246 15.7769 10.7564 15.4451 11.1637 15.4451C11.5709 15.4451 11.9028 15.7769 11.9028 16.1842C11.9028 16.5914 11.5709 16.9233 11.1637 16.9233C10.7564 16.9233 10.4246 16.5914 10.4246 16.1842Z" fill="#4F4F4F"/><path d="M22.9898 13.9668C21.7673 13.9668 20.7725 14.9617 20.7725 16.1842C20.7725 17.4067 21.7673 18.4016 22.9898 18.4016C24.2124 18.4016 25.2072 17.4067 25.2072 16.1842C25.2072 14.9617 24.2124 13.9668 22.9898 13.9668ZM22.9898 16.9233C22.5818 16.9233 22.2507 16.5914 22.2507 16.1842C22.2507 15.7769 22.5818 15.4451 22.9898 15.4451C23.3978 15.4451 23.729 15.7769 23.729 16.1842C23.729 16.5914 23.3978 16.9233 22.9898 16.9233Z" fill="#4F4F4F"/><path d="M20.0354 11.0114C20.1463 11.0114 20.2594 10.9863 20.3651 10.9338L23.3216 9.45555C23.6867 9.27298 23.8345 8.82877 23.652 8.46364C23.4687 8.09851 23.0245 7.94994 22.6601 8.13324L19.7035 9.61151C19.3384 9.79407 19.1906 10.2383 19.3732 10.6034C19.5032 10.8621 19.7642 11.0114 20.0354 11.0114Z" fill="#4F4F4F"/><path d="M10.8338 9.4542L13.7903 10.9325C13.896 10.9849 14.0091 11.0101 14.1199 11.0101C14.3912 11.0101 14.6521 10.8608 14.7822 10.6013C14.9648 10.2362 14.8169 9.79198 14.4518 9.60942L11.4953 8.13116C11.1287 7.94785 10.6859 8.09716 10.5034 8.46155C10.3201 8.82742 10.4686 9.2709 10.8338 9.4542Z" fill="#4F4F4F"/><path d="M17.0776 21.3574C14.3214 21.3574 11.696 22.5252 9.87475 24.5601C9.60275 24.8646 9.62862 25.3317 9.9324 25.6037C10.2369 25.8765 10.7041 25.8498 10.9761 25.5461C12.5179 23.8232 14.7412 22.8357 17.0776 22.8357C19.4125 22.8357 21.6365 23.8232 23.1791 25.5461C23.3247 25.7094 23.5272 25.7922 23.7298 25.7922C23.9057 25.7922 24.0823 25.7301 24.2228 25.6037C24.5265 25.331 24.5524 24.8646 24.2804 24.5601C22.4577 22.5245 19.8331 21.3574 17.0776 21.3574Z" fill="#4F4F4F"/></svg>'
  const iconScore25 =
    '<button><svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.21289" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0959 12.9537C14.0959 11.7312 13.101 10.7363 11.8785 10.7363C10.656 10.7363 9.66113 11.7312 9.66113 12.9537C9.66113 14.1762 10.656 15.1711 11.8785 15.1711C13.101 15.1711 14.0959 14.1762 14.0959 12.9537ZM11.1394 12.9537C11.1394 12.5465 11.4713 12.2146 11.8785 12.2146C12.2858 12.2146 12.6177 12.5465 12.6177 12.9537C12.6177 13.361 12.2858 13.6928 11.8785 13.6928C11.4713 13.6928 11.1394 13.361 11.1394 12.9537ZM23.7032 10.7363C22.4807 10.7363 21.4858 11.7312 21.4858 12.9537C21.4858 14.1762 22.4807 15.1711 23.7032 15.1711C24.9257 15.1711 25.9206 14.1762 25.9206 12.9537C25.9206 11.7312 24.9257 10.7363 23.7032 10.7363ZM23.7032 13.6928C23.2952 13.6928 22.9641 13.361 22.9641 12.9537C22.9641 12.5465 23.2952 12.2146 23.7032 12.2146C24.1112 12.2146 24.4424 12.5465 24.4424 12.9537C24.4424 13.361 24.1112 13.6928 23.7032 13.6928ZM10.5882 22.8081C12.4102 20.7726 15.0356 19.6055 17.7911 19.6055C20.5473 19.6055 23.1719 20.7733 24.9939 22.8081C25.2659 23.1126 25.24 23.5798 24.9362 23.8518C24.7958 23.9782 24.6184 24.0402 24.4432 24.0402C24.2407 24.0402 24.0382 23.9575 23.8926 23.7941C22.3508 22.0712 20.1267 21.0837 17.7911 21.0837C15.4554 21.0837 13.2314 22.0712 11.6895 23.7941C11.4175 24.0979 10.9504 24.1245 10.6459 23.8518C10.3421 23.5798 10.3162 23.1126 10.5882 22.8081Z" fill="#4F4F4F"/></svg>'
  const iconScore50 =
    '<svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.30664" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M11.9703 16.0656C13.1928 16.0656 14.1877 15.0708 14.1877 13.8483C14.1877 12.6257 13.1928 11.6309 11.9703 11.6309C10.7478 11.6309 9.75293 12.6257 9.75293 13.8483C9.75293 15.0708 10.7478 16.0656 11.9703 16.0656ZM11.9703 13.1091C12.3776 13.1091 12.7095 13.441 12.7095 13.8483C12.7095 14.2555 12.3776 14.5874 11.9703 14.5874C11.5631 14.5874 11.2312 14.2555 11.2312 13.8483C11.2312 13.441 11.5631 13.1091 11.9703 13.1091Z" fill="#4F4F4F"/><path d="M23.7965 11.6309C22.574 11.6309 21.5791 12.6257 21.5791 13.8483C21.5791 15.0708 22.574 16.0656 23.7965 16.0656C25.019 16.0656 26.0139 15.0708 26.0139 13.8483C26.0139 12.6257 25.019 11.6309 23.7965 11.6309ZM23.7965 14.5874C23.3892 14.5874 23.0574 14.2555 23.0574 13.8483C23.0574 13.441 23.3892 13.1091 23.7965 13.1091C24.2037 13.1091 24.5356 13.441 24.5356 13.8483C24.5356 14.2555 24.2037 14.5874 23.7965 14.5874Z" fill="#4F4F4F"/><path d="M25.2747 20.5H10.4921C10.0841 20.5 9.75293 20.8311 9.75293 21.2391C9.75293 21.6471 10.0841 21.9782 10.4921 21.9782H25.2747C25.6827 21.9782 26.0138 21.6471 26.0138 21.2391C26.0138 20.8311 25.6827 20.5 25.2747 20.5Z" fill="#4F4F4F"/></svg>'
  const iconScore75 =
    '<svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.39746" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M14.2795 12.9537C14.2795 11.7312 13.2846 10.7363 12.0621 10.7363C10.8396 10.7363 9.84473 11.7312 9.84473 12.9537C9.84473 14.1762 10.8396 15.1711 12.0621 15.1711C13.2846 15.1711 14.2795 14.1762 14.2795 12.9537ZM11.323 12.9537C11.323 12.5465 11.6549 12.2146 12.0621 12.2146C12.4694 12.2146 12.8012 12.5465 12.8012 12.9537C12.8012 13.361 12.4694 13.6928 12.0621 13.6928C11.6549 13.6928 11.323 13.361 11.323 12.9537Z" fill="#4F4F4F"/><path d="M23.8873 10.7363C22.6648 10.7363 21.6699 11.7312 21.6699 12.9537C21.6699 14.1762 22.6648 15.1711 23.8873 15.1711C25.1098 15.1711 26.1047 14.1762 26.1047 12.9537C26.1047 11.7312 25.1098 10.7363 23.8873 10.7363ZM23.8873 13.6928C23.48 13.6928 23.1482 13.361 23.1482 12.9537C23.1482 12.5465 23.48 12.2146 23.8873 12.2146C24.2946 12.2146 24.6264 12.5465 24.6264 12.9537C24.6264 13.361 24.2946 13.6928 23.8873 13.6928Z" fill="#4F4F4F"/><path d="M25.1215 19.794C24.8169 19.5213 24.3491 19.5479 24.0778 19.8516C22.536 21.5746 20.3127 22.562 17.9763 22.562C15.6406 22.562 13.4166 21.5746 11.8747 19.8516C11.602 19.5479 11.1356 19.5213 10.8311 19.794C10.5266 20.066 10.5014 20.5331 10.7734 20.8376C12.5954 22.8732 15.2208 24.0403 17.9763 24.0403C20.7325 24.0403 23.3579 22.8725 25.1791 20.8376C25.4511 20.5331 25.4252 20.066 25.1215 19.794Z" fill="#4F4F4F"/></svg>'
  const iconScore100 =
    '<svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.30176" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M23.7916 8.05273C22.5691 8.05273 21.5742 9.0476 21.5742 10.2701C21.5742 11.4926 22.5691 12.4875 23.7916 12.4875C25.0141 12.4875 26.009 11.4926 26.009 10.2701C26.009 9.0476 25.0141 8.05273 23.7916 8.05273ZM23.7916 11.0093C23.3836 11.0093 23.0525 10.6774 23.0525 10.2701C23.0525 9.86286 23.3836 9.531 23.7916 9.531C24.1996 9.531 24.5307 9.86286 24.5307 10.2701C24.5307 10.6774 24.1996 11.0093 23.7916 11.0093Z" fill="#4F4F4F"/><path d="M11.9654 12.4875C13.188 12.4875 14.1828 11.4926 14.1828 10.2701C14.1828 9.0476 13.188 8.05273 11.9654 8.05273C10.7429 8.05273 9.74805 9.0476 9.74805 10.2701C9.74805 11.4926 10.7429 12.4875 11.9654 12.4875ZM11.9654 9.531C12.3734 9.531 12.7046 9.86286 12.7046 10.2701C12.7046 10.6774 12.3734 11.0093 11.9654 11.0093C11.5574 11.0093 11.2263 10.6774 11.2263 10.2701C11.2263 9.86286 11.5574 9.531 11.9654 9.531Z" fill="#4F4F4F"/><path d="M25.2698 16.9219H10.4872C10.0784 16.9219 9.74805 17.253 9.74805 17.661C9.74805 22.1438 13.3957 25.7914 17.8785 25.7914C22.3613 25.7914 26.0089 22.1438 26.0089 17.661C26.0089 17.253 25.6785 16.9219 25.2698 16.9219ZM17.8785 24.3132C14.46 24.3132 11.6365 21.7218 11.2677 18.4001H24.4893C24.1204 21.7218 21.297 24.3132 17.8785 24.3132Z" fill="#4F4F4F"/></svg>'
  const iconScore0Filled =
    '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#E33737"/><path d="M13.382 16.1842C13.382 14.9617 12.3872 13.9668 11.1647 13.9668C9.94214 13.9668 8.94727 14.9617 8.94727 16.1842C8.94727 17.4067 9.94214 18.4016 11.1647 18.4016C12.3872 18.4016 13.382 17.4067 13.382 16.1842ZM10.4255 16.1842C10.4255 15.7769 10.7574 15.4451 11.1647 15.4451C11.5719 15.4451 11.9038 15.7769 11.9038 16.1842C11.9038 16.5914 11.5719 16.9233 11.1647 16.9233C10.7574 16.9233 10.4255 16.5914 10.4255 16.1842Z" fill="white"/><path d="M22.9908 13.9668C21.7683 13.9668 20.7734 14.9617 20.7734 16.1842C20.7734 17.4067 21.7683 18.4016 22.9908 18.4016C24.2133 18.4016 25.2082 17.4067 25.2082 16.1842C25.2082 14.9617 24.2133 13.9668 22.9908 13.9668ZM22.9908 16.9233C22.5828 16.9233 22.2517 16.5914 22.2517 16.1842C22.2517 15.7769 22.5828 15.4451 22.9908 15.4451C23.3988 15.4451 23.73 15.7769 23.73 16.1842C23.73 16.5914 23.3988 16.9233 22.9908 16.9233Z" fill="white"/><path d="M20.0354 11.0114C20.1463 11.0114 20.2594 10.9863 20.3651 10.9338L23.3216 9.45555C23.6867 9.27298 23.8345 8.82877 23.652 8.46364C23.4687 8.09851 23.0245 7.94994 22.6601 8.13324L19.7035 9.61151C19.3384 9.79407 19.1906 10.2383 19.3732 10.6034C19.5032 10.8621 19.7642 11.0114 20.0354 11.0114Z" fill="white"/><path d="M10.8347 9.4542L13.7913 10.9325C13.8969 10.9849 14.01 11.0101 14.1209 11.0101C14.3922 11.0101 14.6531 10.8608 14.7832 10.6013C14.9657 10.2362 14.8179 9.79198 14.4528 9.60942L11.4963 8.13116C11.1296 7.94785 10.6869 8.09716 10.5043 8.46155C10.321 8.82742 10.4696 9.2709 10.8347 9.4542Z" fill="white"/><path d="M17.0776 21.3594C14.3214 21.3594 11.696 22.5272 9.87475 24.562C9.60275 24.8665 9.62862 25.3337 9.9324 25.6057C10.2369 25.8784 10.7041 25.8518 10.9761 25.548C12.5179 23.8251 14.7412 22.8376 17.0776 22.8376C19.4125 22.8376 21.6365 23.8251 23.1791 25.548C23.3247 25.7114 23.5272 25.7941 23.7298 25.7941C23.9057 25.7941 24.0823 25.7321 24.2228 25.6057C24.5265 25.3329 24.5524 24.8665 24.2804 24.562C22.4577 22.5265 19.8331 21.3594 17.0776 21.3594Z" fill="white"/></svg>'
  const iconScore25Filled =
    '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#AE563A"/><path d="M13.382 12.9557C13.382 11.7332 12.3872 10.7383 11.1647 10.7383C9.94214 10.7383 8.94727 11.7332 8.94727 12.9557C8.94727 14.1782 9.94214 15.1731 11.1647 15.1731C12.3872 15.1731 13.382 14.1782 13.382 12.9557ZM10.4255 12.9557C10.4255 12.5484 10.7574 12.2165 11.1647 12.2165C11.5719 12.2165 11.9038 12.5484 11.9038 12.9557C11.9038 13.3629 11.5719 13.6948 11.1647 13.6948C10.7574 13.6948 10.4255 13.3629 10.4255 12.9557Z" fill="white"/><path d="M22.9908 10.7383C21.7683 10.7383 20.7734 11.7332 20.7734 12.9557C20.7734 14.1782 21.7683 15.1731 22.9908 15.1731C24.2133 15.1731 25.2082 14.1782 25.2082 12.9557C25.2082 11.7332 24.2133 10.7383 22.9908 10.7383ZM22.9908 13.6948C22.5828 13.6948 22.2517 13.3629 22.2517 12.9557C22.2517 12.5484 22.5828 12.2165 22.9908 12.2165C23.3988 12.2165 23.73 12.5484 23.73 12.9557C23.73 13.3629 23.3988 13.6948 22.9908 13.6948Z" fill="white"/><path d="M17.0776 19.6055C14.3221 19.6055 11.6967 20.7726 9.87475 22.8081C9.60275 23.1126 9.62862 23.5798 9.9324 23.8518C10.2369 24.1245 10.7041 24.0979 10.9761 23.7941C12.5179 22.0712 14.7419 21.0837 17.0776 21.0837C19.4132 21.0837 21.6373 22.0712 23.1791 23.7941C23.3247 23.9575 23.5272 24.0402 23.7298 24.0402C23.9049 24.0402 24.0823 23.9782 24.2228 23.8518C24.5265 23.5798 24.5524 23.1126 24.2804 22.8081C22.4584 20.7733 19.8338 19.6055 17.0776 19.6055Z" fill="white"/></svg>'
  const iconScore50Filled =
    '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#333"/><path d="M11.1647 16.0656C12.3872 16.0656 13.382 15.0708 13.382 13.8483C13.382 12.6257 12.3872 11.6309 11.1647 11.6309C9.94214 11.6309 8.94727 12.6257 8.94727 13.8483C8.94727 15.0708 9.94214 16.0656 11.1647 16.0656ZM11.1647 13.1091C11.5719 13.1091 11.9038 13.441 11.9038 13.8483C11.9038 14.2555 11.5719 14.5874 11.1647 14.5874C10.7574 14.5874 10.4255 14.2555 10.4255 13.8483C10.4255 13.441 10.7574 13.1091 11.1647 13.1091Z" fill="white"/><path d="M22.9908 11.6309C21.7683 11.6309 20.7734 12.6257 20.7734 13.8483C20.7734 15.0708 21.7683 16.0656 22.9908 16.0656C24.2133 16.0656 25.2082 15.0708 25.2082 13.8483C25.2082 12.6257 24.2133 11.6309 22.9908 11.6309ZM22.9908 14.5874C22.5836 14.5874 22.2517 14.2555 22.2517 13.8483C22.2517 13.441 22.5836 13.1091 22.9908 13.1091C23.3981 13.1091 23.73 13.441 23.73 13.8483C23.73 14.2555 23.3981 14.5874 22.9908 14.5874Z" fill="white"/><path d="M24.469 20.502H9.6864C9.2784 20.502 8.94727 20.8331 8.94727 21.2411C8.94727 21.6491 9.2784 21.9802 9.6864 21.9802H24.469C24.877 21.9802 25.2081 21.6491 25.2081 21.2411C25.2081 20.8331 24.877 20.502 24.469 20.502Z" fill="white"/></svg>'
  const iconScore75Filled =
    '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#F3BE40"/><path d="M13.382 12.9537C13.382 11.7312 12.3872 10.7363 11.1647 10.7363C9.94214 10.7363 8.94727 11.7312 8.94727 12.9537C8.94727 14.1762 9.94214 15.1711 11.1647 15.1711C12.3872 15.1711 13.382 14.1762 13.382 12.9537ZM10.4255 12.9537C10.4255 12.5465 10.7574 12.2146 11.1647 12.2146C11.5719 12.2146 11.9038 12.5465 11.9038 12.9537C11.9038 13.361 11.5719 13.6929 11.1647 13.6929C10.7574 13.6929 10.4255 13.361 10.4255 12.9537Z" fill="white"/><path d="M22.9908 10.7363C21.7683 10.7363 20.7734 11.7312 20.7734 12.9537C20.7734 14.1762 21.7683 15.1711 22.9908 15.1711C24.2133 15.1711 25.2082 14.1762 25.2082 12.9537C25.2082 11.7312 24.2133 10.7363 22.9908 10.7363ZM22.9908 13.6929C22.5836 13.6929 22.2517 13.361 22.2517 12.9537C22.2517 12.5465 22.5836 12.2146 22.9908 12.2146C23.3981 12.2146 23.73 12.5465 23.73 12.9537C23.73 13.361 23.3981 13.6929 22.9908 13.6929Z" fill="white"/><path d="M24.223 19.794C23.9185 19.5213 23.4506 19.5479 23.1794 19.8516C21.6375 21.5746 19.4142 22.562 17.0778 22.562C14.7422 22.562 12.5181 21.5746 10.9763 19.8516C10.7036 19.5479 10.2372 19.5213 9.93266 19.794C9.62814 20.066 9.60301 20.5331 9.87501 20.8376C11.697 22.8732 14.3224 24.0403 17.0778 24.0403C19.8341 24.0403 22.4594 22.8725 24.2807 20.8376C24.5527 20.5331 24.5268 20.066 24.223 19.794Z" fill="white"/></svg>'
  const iconScore100Filled =
    '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#3CA53E"/><path d="M22.9899 8.05273C21.7673 8.05273 20.7725 9.0476 20.7725 10.2701C20.7725 11.4926 21.7673 12.4875 22.9899 12.4875C24.2124 12.4875 25.2072 11.4926 25.2072 10.2701C25.2072 9.0476 24.2124 8.05273 22.9899 8.05273ZM22.9899 11.0093C22.5819 11.0093 22.2507 10.6774 22.2507 10.2701C22.2507 9.86286 22.5819 9.531 22.9899 9.531C23.3979 9.531 23.729 9.86286 23.729 10.2701C23.729 10.6774 23.3979 11.0093 22.9899 11.0093Z" fill="white"/><path d="M11.1656 12.4875C12.3882 12.4875 13.383 11.4926 13.383 10.2701C13.383 9.0476 12.3882 8.05273 11.1656 8.05273C9.94311 8.05273 8.94824 9.0476 8.94824 10.2701C8.94824 11.4926 9.94311 12.4875 11.1656 12.4875ZM11.1656 9.531C11.5736 9.531 11.9048 9.86286 11.9048 10.2701C11.9048 10.6774 11.5736 11.0093 11.1656 11.0093C10.7576 11.0093 10.4265 10.6774 10.4265 10.2701C10.4265 9.86286 10.7576 9.531 11.1656 9.531Z" fill="white"/><path d="M24.469 16.9219H9.6864C9.27766 16.9219 8.94727 17.253 8.94727 17.661C8.94727 22.1438 12.5949 25.7914 17.0777 25.7914C21.5605 25.7914 25.2081 22.1438 25.2081 17.661C25.2081 17.253 24.8777 16.9219 24.469 16.9219ZM17.0777 24.3132C13.6592 24.3132 10.8357 21.7218 10.4669 18.4001H23.6885C23.3197 21.7218 20.4962 24.3132 17.0777 24.3132Z" fill="white"/></svg>'
  const iconRadio =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="black"/></svg>'
  const iconRadioChecked =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" fill="black"/></svg>'
  const iconCheck =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 1.5H2C1.72386 1.5 1.5 1.72386 1.5 2V14C1.5 14.2761 1.72386 14.5 2 14.5H14C14.2761 14.5 14.5 14.2761 14.5 14V2C14.5 1.72386 14.2761 1.5 14 1.5ZM2 0C0.895431 0 0 0.895431 0 2V14C0 15.1046 0.895431 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2Z" fill="black"/></svg>'
  const iconCheckChecked =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 1.5H14C14.2761 1.5 14.5 1.72386 14.5 2V14C14.5 14.2761 14.2761 14.5 14 14.5H2C1.72386 14.5 1.5 14.2761 1.5 14V2C1.5 1.72386 1.72386 1.5 2 1.5ZM0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2ZM13.2207 5.28042C13.5136 4.98753 13.5136 4.51266 13.2207 4.21976C12.9278 3.92687 12.4529 3.92687 12.16 4.21977L6.54093 9.83917C6.44326 9.93683 6.28492 9.93679 6.1873 9.83919L4.28033 7.93265C3.98744 7.63976 3.51257 7.63976 3.21967 7.93265C2.92678 8.22554 2.92678 8.70042 3.21967 8.99331L5.12666 10.8999C6.22009 11.9933 6.91813 11.5832 7.60156 10.8999L13.2207 5.28042Z" fill="black"/></svg>'
  const iconAddAttachment =
    '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="0.5" y="0.5" width="39" height="39" rx="5.5" stroke="#000" stroke-opacity="0.4" stroke-dasharray="4 4"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26 14.5H14C13.7239 14.5 13.5 14.7239 13.5 15V22.6762L15.5602 21.1065C16.0817 20.7092 16.7814 20.6366 17.3732 20.9185L19.6918 22.0225C19.7865 22.0676 19.8992 22.0488 19.9742 21.9754L22.9257 19.0841C23.5578 18.4649 24.5526 18.415 25.2435 18.9677L26.5 19.9729V15C26.5 14.7239 26.2761 14.5 26 14.5ZM26.5 21.8938L24.3065 20.139C24.2078 20.06 24.0657 20.0672 23.9754 20.1556L21.0239 23.0469C20.4993 23.5608 19.7098 23.6925 19.0469 23.3768L16.7283 22.2727C16.6438 22.2325 16.5438 22.2428 16.4693 22.2996L13.5 24.5619V25C13.5 25.2761 13.7239 25.5 14 25.5H26C26.2761 25.5 26.5 25.2761 26.5 25V21.8938ZM14 13C12.8954 13 12 13.8954 12 15V25C12 26.1046 12.8954 27 14 27H26C27.1046 27 28 26.1046 28 25V15C28 13.8954 27.1046 13 26 13H14ZM17 17.5C17 16.6716 17.6716 16 18.5 16C19.3284 16 20 16.6716 20 17.5C20 18.3284 19.3284 19 18.5 19C17.6716 19 17 18.3284 17 17.5Z" fill="#000"/></svg>'
  const iconRemoveAttachment =
    '<svg width="19" height="19" viewBox="0 0 19 19" fill="none"><rect width="19" height="19" fill="#EB5757" /><rect x="5" y="8.625" width="9" height="1.75" fill="#fff" /></svg>'

  const [containerId] = parseCollection(collection)

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
  containerElement.style.minHeight = "425px"

  const contentElement = document.createElement("div")
  containerElement.appendChild(contentElement)

  const closeElement = document.createElement("button")
  closeElement.setAttribute("class", "_q-cancel")
  closeElement.setAttribute("title", localized("form.close", options?.locale))
  closeElement.setAttribute("tabindex", "9001")
  closeElement.innerHTML =
    '<svg fill="none" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L17 17M17 1L1 17L17 1Z" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>'
  contentElement.appendChild(closeElement)

  const titleElement = document.createElement("h2")
  titleElement.textContent = options?.title || localized("form.title", options?.locale)
  contentElement.appendChild(titleElement)

  const buttonsElement = document.createElement("ul")
  buttonsElement.setAttribute("class", "_q-buttons")

  const cancelElement = document.createElement("li")
  buttonsElement.appendChild(cancelElement)

  const cancelButtonElement = document.createElement("button")
  cancelButtonElement.textContent = localized("form.cancel", options?.locale)
  cancelButtonElement.setAttribute("tabindex", "9202")
  cancelElement.appendChild(cancelButtonElement)

  const sendElement = document.createElement("li")
  buttonsElement.appendChild(sendElement)

  const sendButtonElement = document.createElement("button")
  sendButtonElement.setAttribute("tabindex", "9203")
  sendButtonElement.disabled = true
  sendButtonElement.innerHTML =
    '<svg width="16" height="15" viewBox="0 0 16 15" fill="none"><path d="M15 3V9C15 10.1046 14.1046 11 13 11H5.82843C5.29799 11 4.78929 11.2107 4.41421 11.5858L2.70711 13.2929C2.07714 13.9229 1 13.4767 1 12.5858V3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3Z" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    localized("form.send", options?.locale)
  sendElement.appendChild(sendButtonElement)

  const successElement = document.createElement("ul")
  successElement.setAttribute("class", "_q-success")

  const successTextElement = document.createElement("li")
  successTextElement.textContent = localized("form.sending", options?.locale)
  successElement.appendChild(successTextElement)

  const successCloseElement = document.createElement("li")
  successElement.appendChild(successCloseElement)

  const successButtonElement = document.createElement("button")
  sendButtonElement.setAttribute("tabindex", "9204")
  successButtonElement.innerHTML =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11L11 1Z" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    localized("form.close", options?.locale)
  successCloseElement.appendChild(successButtonElement)

  const scoreElements: HTMLUListElement[] = []
  const textareaElements: HTMLTextAreaElement[] = []

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

  const setEnabled = (isEnabled: boolean): void => {
    scoreElements.forEach((x) => {
      if (isEnabled) {
        x.className = x.className.replace(" _q-empty", "")
        x.previousElementSibling?.className.replace(" _q-empty", "")
      } else {
        if (!x.querySelector("_q-selected")) {
          x.className += " _q-empty"
          if (x.previousElementSibling?.tagName === "P") {
            x.previousElementSibling.className += " _q-empty"
          }
        }
      }
    })
    textareaElements.forEach((x) => {
      x.disabled = !isEnabled
      if (isEnabled) {
        x.className = x.className.replace(" _q-empty", "")
        x.previousElementSibling?.className.replace(" _q-empty", "")
      } else {
        if (x.value.trim() == "") {
          x.className += " _q-empty"
          if (x.previousElementSibling?.tagName === "P") {
            x.previousElementSibling.className += " _q-empty"
          }
        }
      }
    })
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
        setEnabled(false)

        successTextElement.innerHTML =
          '<svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M15 1L6.3738 9.62623C5.98325 10.0167 5.35008 10.0167 4.95956 9.62623L1 5.66663" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          localized("form.sent", options?.locale)

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
              if (content.value == null) {
                return
              }
              break
            case "text":
            case "select":
              if (content.value == null) {
                return
              }
              break
            case "multiselect":
            case "attachments":
              if (content.values.length == 0) {
                return
              }
              break
          }

          if (!currentResultElement || content.type == "title") {
            currentResultElement = document.createElement("div")
            currentResultElement.className = "_q-result"
            contentElement.appendChild(currentResultElement)
            resultElements.push(currentResultElement)
          }

          switch (content.type) {
            case "title":
              break
            case "score": {
              switch (content.scoreType) {
                case "smilies3":
                case "smilies5": {
                  const scoreElement = document.createElement("div")
                  scoreElement.className = "_q-scored"
                  switch (content.value) {
                    case 0:
                      scoreElement.innerHTML = iconScore0Filled
                      break
                    case 25:
                      scoreElement.innerHTML = iconScore25Filled
                      break
                    case 50:
                      scoreElement.innerHTML = iconScore50Filled
                      break
                    case 75:
                      scoreElement.innerHTML = iconScore75Filled
                      break
                    case 100:
                      scoreElement.innerHTML = iconScore100Filled
                      break
                  }
                  currentResultElement.appendChild(scoreElement)
                  break
                }
                case "nps": {
                  const textContainerElement = document.createElement("div")
                  textContainerElement.setAttribute("class", "_q-leading-trailing")
                  currentResultElement.appendChild(textContainerElement)

                  const trailingTextElement = document.createElement("span")
                  trailingTextElement.innerText =
                    content.trailingText || localized(`form.nps.trailing`, options?.locale)
                  textContainerElement.appendChild(trailingTextElement)

                  const leadingTextElement = document.createElement("span")
                  leadingTextElement.innerText = content.leadingText || localized(`form.nps.leading`, options?.locale)
                  textContainerElement.appendChild(leadingTextElement)

                  const scoresElement = document.createElement("ul")
                  scoresElement.setAttribute("class", "_q-score _q-nps")
                  scoresNPS.forEach((score) => {
                    if (score != 0) {
                      const spaceElement = document.createElement("li")
                      spaceElement.innerHTML = "&nbsp;"
                      scoresElement.appendChild(spaceElement)
                    }

                    let level: number
                    if (score <= 20) {
                      level = 0
                    } else if (score <= 60) {
                      level = 1
                    } else if (score <= 80) {
                      level = 2
                    } else {
                      level = 3
                    }

                    const liElement = document.createElement("li")
                    liElement.setAttribute("class", `_q-l${level}${content.value == score ? " _q-selected" : ""}`)
                    scoresElement.appendChild(liElement)

                    const spanElement = document.createElement("span")
                    spanElement.innerHTML = score / 10 + ""
                    liElement.appendChild(spanElement)
                  })
                  currentResultElement.appendChild(scoresElement)
                  break
                }
              }
              break
            }
            case "text": {
              const pElement = document.createElement("p")
              pElement.className = "_q-after"
              pElement.innerHTML = content.value || ""
              currentResultElement.appendChild(pElement)
              break
            }
            case "select": {
              const divElement = document.createElement("div")
              divElement.className = "_q-option"
              divElement.innerHTML = iconRadioChecked

              const spanElement = document.createElement("span")
              spanElement.innerText = content.value || ""
              divElement.appendChild(spanElement)

              currentResultElement.appendChild(divElement)
              break
            }
            case "multiselect": {
              content.values.forEach((value) => {
                const divElement = document.createElement("div")
                divElement.className = "_q-option"
                divElement.innerHTML = iconCheckChecked

                const spanElement = document.createElement("span")
                spanElement.innerText = value
                divElement.appendChild(spanElement)

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                currentResultElement!.appendChild(divElement)
              })
              break
            }
            case "attachments": {
              const divElement = document.createElement("div")
              divElement.className = "_q-attached"
              currentResultElement.appendChild(divElement)

              content.values.forEach((attachment, index) => {
                const imgElement = document.createElement("img")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                imgElement.setAttribute("src", (attachment as any).localUrl)
                imgElement.setAttribute("title", localized("form.image.index") + (index + 1))
                divElement.appendChild(imgElement)
              })
              break
            }
          }
        })

        contentElement.removeChild(successElement)
        contentElement.removeChild(buttonsElement)
        contentElement.appendChild(successElement)
        contentElement.appendChild(buttonsElement)
      })
      .catch((error) => {
        containerElement.className = containerElement.className = " _q-error"
        successTextElement.textContent = localized("form.error", options?.locale)
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
      let contentTabindex = 9100

      const mainTitleElement = document.createElement("p")
      mainTitleElement.textContent = question.name
      contentElement.appendChild(mainTitleElement)

      question.content.forEach((questionContent, contentIndex) => {
        switch (questionContent.type) {
          case "title": {
            const titleElement = document.createElement("p")
            titleElement.textContent = questionContent.text
            contentElement.appendChild(titleElement)
            break
          }
          case "score": {
            const scoresElement = document.createElement("ul")
            scoreElements.push(scoresElement)

            const optionButtonElements: HTMLButtonElement[] = []
            let optionElements: HTMLLIElement[]
            let scores: number[]

            switch (questionContent.scoreType) {
              case "smilies5":
              case "smilies3":
                scoresElement.setAttribute("class", "_q-score _q-smilies")

                scores = questionContent.scoreType == "smilies5" ? scoresSmilies5 : scoresSmilies3
                optionElements = scores.map((score) => {
                  if (score != 0) {
                    const spaceElement = document.createElement("li")
                    spaceElement.innerHTML = "&nbsp;"
                    scoresElement.appendChild(spaceElement)
                  }

                  const optionElement = document.createElement("li")
                  optionElement.setAttribute("class", `_q-option _q-${score}`)
                  scoresElement.appendChild(optionElement)

                  const buttonElement = document.createElement("button")
                  buttonElement.setAttribute("tabindex", contentTabindex + "")
                  buttonElement.setAttribute("title", localized(`form.score.${score}`, options?.locale))
                  optionButtonElements.push(buttonElement)
                  optionElement.appendChild(buttonElement)
                  contentTabindex++

                  switch (score) {
                    case 0:
                      buttonElement.innerHTML = iconScore0 + iconScore0Filled
                      break
                    case 25:
                      buttonElement.innerHTML = iconScore25 + iconScore25Filled
                      break
                    case 50:
                      buttonElement.innerHTML = iconScore50 + iconScore50Filled
                      break
                    case 75:
                      buttonElement.innerHTML = iconScore75 + iconScore75Filled
                      break
                    case 100:
                      buttonElement.innerHTML = iconScore100 + iconScore100Filled
                      break
                  }

                  return optionElement
                })
                break
              case "nps": {
                scoresElement.setAttribute("class", "_q-score _q-nps")

                const textContainerElement = document.createElement("div")
                textContainerElement.setAttribute("class", "_q-leading-trailing")
                contentElement.appendChild(textContainerElement)

                const trailingTextElement = document.createElement("span")
                trailingTextElement.innerText =
                  questionContent.trailingText || localized(`form.nps.trailing`, options?.locale)
                textContainerElement.appendChild(trailingTextElement)

                const leadingTextElement = document.createElement("span")
                leadingTextElement.innerText =
                  questionContent.leadingText || localized(`form.nps.leading`, options?.locale)
                textContainerElement.appendChild(leadingTextElement)

                scores = scoresNPS
                optionElements = scores.map((score) => {
                  if (score != 0) {
                    const spaceElement = document.createElement("li")
                    spaceElement.innerHTML = "&nbsp;"
                    scoresElement.appendChild(spaceElement)
                  }

                  let level: number
                  if (score <= 20) {
                    level = 0
                  } else if (score <= 60) {
                    level = 1
                  } else if (score <= 80) {
                    level = 2
                  } else {
                    level = 3
                  }

                  const optionElement = document.createElement("li")
                  optionElement.setAttribute("class", `_q-option _q-l${level}`)
                  scoresElement.appendChild(optionElement)

                  const buttonElement = document.createElement("button")
                  buttonElement.setAttribute("tabindex", contentTabindex + "")
                  buttonElement.innerHTML = score / 10 + ""
                  optionButtonElements.push(buttonElement)
                  optionElement.appendChild(buttonElement)
                  contentTabindex++

                  return optionElement
                })
                break
              }
              default:
                return // Not implemented yet
            }

            contentElement.appendChild(scoresElement)

            optionButtonElements.forEach((buttonElement, index) => {
              buttonElement.onclick = () => {
                if (entryReference) return

                optionElements.forEach((x) => (x.className = x.className.replace(" _q-selected", "")))

                const contentScore = content[contentIndex] as EntryContentScore
                if (contentScore.value != scores[index]) {
                  optionElements[index].className += " _q-selected"
                  contentScore.value = scores[index]
                } else {
                  contentScore.value = null
                }
                invalidateCanSend()
              }
            })
            break
          }
          case "text": {
            const textareaElement = document.createElement("textarea")
            textareaElement.setAttribute(
              "placeholder",
              questionContent.placeholder || localized("form.text-placeholder", options?.locale)
            )
            textareaElement.setAttribute("tabindex", contentTabindex + "")
            contentElement.appendChild(textareaElement)
            textareaElements.push(textareaElement)
            contentTabindex++

            textareaElement.oninput = () => {
              const text = textareaElement.value.trim() == "" ? null : textareaElement.value
              ;(content[contentIndex] as EntryContentText).value = text
              invalidateCanSend()
            }
            break
          }
          case "select":
          case "multiselect": {
            const selectContainerElement = document.createElement("div")
            selectContainerElement.className =
              "_q-options " + (questionContent.type == "select" ? "_q-select" : "_q-multiselect")
            contentElement.appendChild(selectContainerElement)

            const buttonElements = questionContent.options.map((option) => {
              const button = document.createElement("button")
              button.setAttribute("tabindex", contentTabindex + "")
              selectContainerElement.appendChild(button)
              contentTabindex++

              const iconElement = document.createElement("span")
              iconElement.innerHTML = questionContent.type == "select" ? iconRadio : iconCheck
              button.appendChild(iconElement)

              const titleElement = document.createElement("span")
              titleElement.textContent = option
              button.appendChild(titleElement)

              return button
            })

            buttonElements.forEach((buttonElement, buttonIndex) => {
              buttonElement.onclick = () => {
                if (questionContent.type == "select") {
                  buttonElements.forEach((x) => {
                    x.className = ""
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    x.querySelector("span:first-child")!.innerHTML = iconRadio
                  })

                  const x = content[contentIndex] as EntryContentSelect
                  const option = (questionContent as QuestionContentSelect).options[buttonIndex]
                  if (x.value == option) {
                    x.value = null
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    buttonElement.querySelector("span:first-child")!.innerHTML = iconRadio
                  } else {
                    x.value = option
                    buttonElement.className = "_q-selected"
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    buttonElement.querySelector("span:first-child")!.innerHTML = iconRadioChecked
                  }
                } else {
                  if (buttonElement.className == "_q-selected") {
                    buttonElement.className = ""
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    buttonElement.querySelector("span:first-child")!.innerHTML = iconCheck
                  } else {
                    buttonElement.className = "_q-selected"
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    buttonElement.querySelector("span:first-child")!.innerHTML = iconCheckChecked
                  }

                  const x = content[contentIndex] as EntryContentMultiselect
                  const options = (questionContent as QuestionContentMultiselect).options
                  x.values = buttonElements
                    .map((x, index) => (x.className != "_q-selected" ? null : options[index]))
                    .filter((x): x is string => !!x)
                }

                invalidateCanSend()
              }
            })

            break
          }
          case "attachments": {
            const attachmentsElement = document.createElement("div")
            attachmentsElement.className = "_q-attachments"
            contentElement.appendChild(attachmentsElement)

            const fileLabelElement = document.createElement("label")
            fileLabelElement.setAttribute("title", "Add image")
            fileLabelElement.innerHTML = iconAddAttachment
            attachmentsElement.appendChild(fileLabelElement)

            const inputElement = document.createElement("input")
            inputElement.setAttribute("type", "file")
            inputElement.setAttribute("accept", "image/png,image/jpeg")
            inputElement.setAttribute("multiple", "")
            inputElement.setAttribute("tabindex", contentTabindex + "")
            fileLabelElement.appendChild(inputElement)
            contentTabindex++

            inputElement.addEventListener("change", () => {
              if (!inputElement.files || !inputElement.files.length) return

              for (let index = 0; index < Math.min(inputElement.files.length, 10); index++) {
                const f = (index: number) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const file = inputElement.files![index]
                  if (file.type != "image/png" && file.type != "image/jpeg") return

                  const removeButton = document.createElement("button")
                  removeButton.innerHTML = iconRemoveAttachment
                  removeButton.setAttribute("title", "Click to remove")
                  attachmentsElement.insertBefore(removeButton, fileLabelElement)

                  const fileReader = new FileReader()
                  fileReader.onload = () => {
                    const localUrl = fileReader.result
                    removeButton.style.backgroundImage = "url('" + localUrl + "')"

                    uploadAttachment(containerId, file.type as AttachmentContentType, file, options)
                      .then((attachment) => {
                        const x = content[contentIndex] as EntryContentAttachments
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ;(attachment as any).localUrl = localUrl
                        x.values.push(attachment)
                        invalidateCanSend()

                        removeButton.onclick = () => {
                          for (let index = 0; index < x.values.length; index++) {
                            if (x.values[index].id == attachment.id) {
                              x.values.splice(index, 1)
                              attachmentsElement.removeChild(removeButton)
                              if (!fileLabelElement.parentElement) {
                                attachmentsElement.appendChild(fileLabelElement)
                              }
                              break
                            }
                          }
                        }
                      })
                      .catch((error) => {
                        console.error("Failed attachment upload", error)
                        attachmentsElement.removeChild(removeButton)
                      })
                  }
                  fileReader.readAsDataURL(file)
                }
                f(index)
              }

              const x = content[contentIndex] as EntryContentAttachments
              if (x.values.length + inputElement.files.length >= 10) {
                fileLabelElement.parentElement?.removeChild(fileLabelElement)
              }

              inputElement.value = ""
            })
          }
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
      linkElement.textContent = localized("form.support", options.locale) + " ->"
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
        renderQuestionContent()
        canRenderQuestionDirectly = true
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
      successTextElement.textContent = localized("form.error", options?.locale)
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
