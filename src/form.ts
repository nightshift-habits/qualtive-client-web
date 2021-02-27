import { EntryReference, _Options } from "./model"
import { parseCollection } from "./private"
import _ from "./localized"
import { post } from "./post"

/**
 * Optional options to use when posting feedback using built in form-UI.
 */
export type FormOptions = _Options & {
  /**
   * Localized form title to show on top of the form. Default: `"Leave feedback"`.
   */
  title?: string

  /**
   * Localized question title to show in the form. Default: `"What do you think?"`.
   */
  questionTitle?: string

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
   * The locale to use. Default: `navigator.language || en-us`.
   */
  locale?: string

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
  parseCollection(collection) // Validates collection

  const scores = [0, 25, 50, 75, 100]

  let entryReference: EntryReference | null
  let selectedScore: number | null = null

  const styleElement = document.createElement("style")
  styleElement.innerHTML =
    '@font-face{font-family:Inter;font-weight:400;src:url(https://storage.googleapis.com/qualtive-static/fonts/Inter-Regular.woff)}@font-face{font-family:Inter;font-weight:500;src:url(https://storage.googleapis.com/qualtive-static/fonts/Inter-Medium.woff)}@font-face{font-family:Inter;font-weight:600;src:url(https://storage.googleapis.com/qualtive-static/fonts/Inter-SemiBold.woff)}#_q-container *{margin:0;padding:0;box-sizing:border-box;appearance:none;-webkit-appearance:none;box-sizing:border-box;font-family:Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;font-weight:400;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:transparent}#_q-container{width:100%;position:fixed;max-width:375px;background:#fff;box-shadow:0 0 50px rgba(0,0,0,.4);left:50%;top:50%;transform:translate(-50%,-50%);transition:transform .25s,opacity .25s;z-index:99999999}#_q-container._q-out{transform:translate(-50%,-50%) scale(.9);opacity:0}#_q-container :not(textarea){cursor:default;user-select:none;-moz-user-select:none;-webkit-user-select:none}#_q-container div{padding:30px 50px 0}#_q-container button{background:0 0;border:none;cursor:pointer}#_q-container button *{cursor:pointer}#_q-container ul{list-style:none}#_q-container ._q-cancel{margin:0 0 0 auto;display:block;transform:translate(20px,0)}#_q-container ._q-cancel:focus{outline:0;opacity:.7}#_q-container h2{font-size:14px;color:#333;margin:0 0 30px;line-height:20px}#_q-container p{font-size:16px;font-weight:600;line-height:24px;color:#333;margin:30px 0}#_q-container ._q-score{margin:30px 0;display:table;width:100%}#_q-container ._q-score li{display:inline-block;display:table-cell}#_q-container ._q-score li._q-option{width:34px}#_q-container ._q-score li svg:first-child,#_q-container ._q-score li svg:first-child *{cursor:pointer}#_q-container ._q-score li._q-selected svg:first-child{display:none}#_q-container ._q-score li._q-selected svg:last-child{display:inline-block}#_q-container ._q-score button:focus{outline:0}#_q-container ._q-score li._q-0 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-0 svg:first-child:hover [fill="#4F4F4F"]{fill:#e33737}#_q-container ._q-score li._q-0 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-0 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#e33737}#_q-container ._q-score li._q-25 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-25 svg:first-child:hover [fill="#4F4F4F"]{fill:#ae563a}#_q-container ._q-score li._q-25 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-25 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#ae563a}#_q-container ._q-score li._q-50 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [fill="#4F4F4F"]{fill:#333}#_q-container ._q-score li._q-50 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#333}#_q-container ._q-score li._q-75 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-75 svg:first-child:hover [fill="#4F4F4F"]{fill:#f3be40}#_q-container ._q-score li._q-75 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-75 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#f3be40}#_q-container ._q-score li._q-100 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-100 svg:first-child:hover [fill="#4F4F4F"]{fill:#3ca53e}#_q-container ._q-score li._q-100 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-100 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#3ca53e}#_q-container ._q-score li._q-selected button:focus{opacity:.7}#_q-container ._q-score li svg:last-child{display:none}#_q-container textarea{width:100%;resize:none;border:1px solid #333;border-radius:6px;padding:12px 12px;font-size:14px;font-weight:400;outline:0;height:100px;line-height:20px;color:#333}#_q-container textarea:active:not(:disabled),#_q-container textarea:focus:not(:disabled){border:2px solid #0b75b1;padding:11px 11px}#_q-container textarea::-webkit-input-placeholder{color:#333}#_q-container textarea:-moz-placeholder{color:#333}#_q-container textarea::-moz-placeholder{color:#333}#_q-container textarea:-ms-input-placeholder{color:#333}#_q-container textarea::placeholder{color:#333}#_q-container ._q-buttons{margin:30px 0;text-align:right}#_q-container._q-sent ._q-buttons{display:none}#_q-container ._q-buttons li{display:inline-block}#_q-container ._q-buttons li button{display:inline-block;font-weight:600;font-size:14px;padding:9px 12px;line-height:20px}#_q-container button>*{vertical-align:middle}#_q-container button>svg{margin:0 5px 2px 0}#_q-container ._q-buttons li:first-child button{color:#eb5757;margin:0 10px 0 0}#_q-container ._q-buttons li:first-child button:focus,#_q-container ._q-buttons li:first-child button:hover{outline:0;opacity:.7}#_q-container ._q-buttons li:first-child button:active{opacity:.4}#_q-container ._q-buttons li:last-child button{color:#333;border:2px solid #333;border-radius:6px;height:40px;padding:8px 12px}#_q-container ._q-buttons li:last-child button:focus,#_q-container ._q-buttons li:last-child button:hover{border-color:#0b75b1;color:#0b75b1;outline:0}#_q-container ._q-buttons li:last-child button:focus [stroke="#333"],#_q-container ._q-buttons li:last-child button:hover [stroke="#333"]{stroke:#0b75b1}#_q-container ._q-buttons li:last-child button:active{border-color:#1a6e9d;color:#fff;background:#1a6e9d}#_q-container ._q-buttons li:last-child button:active [stroke="#333"]{stroke:#fff}#_q-container ._q-buttons li button:disabled{color:#333;opacity:.3;cursor:default}#_q-container ._q-success{display:none;width:100%;margin:30px 0}#_q-container._q-sent ._q-success{display:table}#_q-container ._q-success li{display:table-cell}#_q-container ._q-success li:first-child{text-align:left;color:#219653;font-weight:600;font-size:14px;vertical-align:middle}#_q-container ._q-success li:first-child svg{margin:1px 6px 0 0}#_q-container ._q-success li:last-child{text-align:right}#_q-container ._q-success li:last-child button{text-align:right;color:#000;border:2px solid #000;border-radius:6px;font-weight:600;font-size:14px;padding:8px 16px;line-height:20px;height:40px}#_q-container ._q-success li:last-child button:focus,#_q-container ._q-success li:last-child button:hover{border-color:#0b75b1;color:#0b75b1;outline:0}#_q-container ._q-success li:last-child button:focus [stroke="#000"],#_q-container ._q-success li:last-child button:hover [stroke="#000"]{stroke:#0b75b1}#_q-container ._q-success li:last-child button:active{color:#fff;background:#1a6e9d;border-color:#1a6e9d}#_q-container ._q-success li:last-child button:active [stroke="#000"]{stroke:#fff}#_q-container ._q-support-link{background:#fcf1d1;font-size:12px;text-align:right;padding:20px 30px 20px 10px;line-height:20px}#_q-container ._q-support-link a:focus{outline:0;text-decoration:underline}#_q-container a{text-decoration:none;font-weight:500;cursor:pointer}#_q-container a:link,#_q-container a:visited{color:#0b75b1}#_q-container a:hover{text-decoration:underline}#_q-container._q-sent textarea{border:0;padding-left:0;padding-right:0;height:auto}#_q-container._q-sent ._q-score{margin:30px 0 10px}#_q-container._q-sent._q-no-text ._q-score{margin:30px 0 0}#_q-container._q-sent._q-no-text textarea{display:none}#_q-container._q-sent ._q-score li:not(._q-selected){display:none}@media only screen and (max-height:560px){#_q-container{position:absolute;left:50%;top:0;transform:translate(-50%,0)}#_q-container._q-out{transform:translate(-50%,0) scale(.9)}}@media only screen and (max-width:450px){#_q-container{max-width:100%}#_q-container textarea{font-size:16px}}@media (prefers-color-scheme:dark){body{background:#000}#_q-container{background:#111}#_q-container ._q-cancel [stroke="#000"]{stroke:#fff}#_q-container h2{color:#fff}#_q-container p{color:#fff}#_q-container ._q-score svg:first-child [fill="#4F4F4F"]{fill:#aaa}#_q-container ._q-score svg:first-child [stroke="#4F4F4F"]{stroke:#aaa}#_q-container ._q-score li._q-50 button:focus [fill="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [fill="#4F4F4F"]{fill:#eee}#_q-container ._q-score li._q-50 button:focus [stroke="#4F4F4F"],#_q-container ._q-score li._q-50 svg:first-child:hover [stroke="#4F4F4F"]{stroke:#eee}#_q-container ._q-score li._q-50 svg:last-child:hover [fill="#4F4F4F"]{fill:#eee}#_q-container ._q-score li._q-50 svg:last-child:hover [stroke="#4F4F4F"]{stroke:#eee}#_q-container textarea{background:#000;border-color:#aaa;color:#fff}#_q-container textarea:active:not(:disabled),#_q-container textarea:focus:not(:disabled){border:2px solid #0b75b1;padding:11px 11px}#_q-container textarea::-webkit-input-placeholder{color:#ddd}#_q-container textarea:-moz-placeholder{color:#ddd}#_q-container textarea::-moz-placeholder{color:#ddd}#_q-container textarea:-ms-input-placeholder{color:#ddd}#_q-container textarea::placeholder{color:#ddd}#_q-container ._q-buttons li:last-child button{color:#ddd;border-color:#ddd}#_q-container ._q-buttons li:last-child button [stroke="#333"]{stroke:#ddd}#_q-container ._q-buttons li button:disabled{color:#ddd}#_q-container ._q-success{display:none;width:100%;margin:30px 0}#_q-container ._q-success li:last-child button{color:#ddd;border-color:#ddd}#_q-container ._q-success li:last-child button [stroke="#000"]{stroke:#ddd}#_q-container ._q-success li:last-child button:active{color:#fff;background:#1a6e9d;border-color:#1a6e9d}#_q-container ._q-success li:last-child button:active [stroke="#000"]{stroke:#fff}#_q-container ._q-support-link{background:#2e2d2a}#_q-container._q-sent textarea{background:0 0}}'
  document.head.appendChild(styleElement)

  const containerElement = document.createElement("div")
  containerElement.setAttribute("id", "_q-container")
  containerElement.setAttribute("class", "_q-out")

  const contentElement = document.createElement("div")
  containerElement.appendChild(contentElement)

  const closeElement = document.createElement("button")
  closeElement.setAttribute("class", "_q-cancel")
  closeElement.setAttribute("title", _("form.close", options?.locale))
  closeElement.setAttribute("tabindex", "9001")
  closeElement.innerHTML =
    '<svg fill="none" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L17 17M17 1L1 17L17 1Z" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>'
  contentElement.appendChild(closeElement)

  const titleElement = document.createElement("h2")
  titleElement.innerHTML = options?.title || _("form.title", options?.locale)
  contentElement.appendChild(titleElement)

  const questionTitleElement = document.createElement("p")
  questionTitleElement.innerHTML = options?.title || _("form.question", options?.locale)
  contentElement.appendChild(questionTitleElement)

  const scoresElement = document.createElement("ul")
  scoresElement.setAttribute("class", "_q-score")
  contentElement.appendChild(scoresElement)

  const optionButtonElements: HTMLButtonElement[] = []
  const optionElements: HTMLLIElement[] = scores.map((score) => {
    if (score != 0) {
      const spaceElement = document.createElement("li")
      spaceElement.innerHTML = "&nbsp;"
      scoresElement.appendChild(spaceElement)
    }

    const optionElement = document.createElement("li")
    optionElement.setAttribute("class", `_q-option _q-${score}`)
    scoresElement.appendChild(optionElement)

    const buttonElement = document.createElement("button")
    buttonElement.setAttribute("tabindex", 9100 + score + "")
    buttonElement.setAttribute("title", _(`form.score.${score}`, options?.locale))
    optionButtonElements.push(buttonElement)
    optionElement.appendChild(buttonElement)

    switch (score) {
      case 0:
        buttonElement.innerHTML =
          '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect x="0.5" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M13.3811 16.1842C13.3811 14.9617 12.3862 13.9668 11.1637 13.9668C9.94116 13.9668 8.94629 14.9617 8.94629 16.1842C8.94629 17.4067 9.94116 18.4016 11.1637 18.4016C12.3862 18.4016 13.3811 17.4067 13.3811 16.1842ZM10.4246 16.1842C10.4246 15.7769 10.7564 15.4451 11.1637 15.4451C11.5709 15.4451 11.9028 15.7769 11.9028 16.1842C11.9028 16.5914 11.5709 16.9233 11.1637 16.9233C10.7564 16.9233 10.4246 16.5914 10.4246 16.1842Z" fill="#4F4F4F"/><path d="M22.9898 13.9668C21.7673 13.9668 20.7725 14.9617 20.7725 16.1842C20.7725 17.4067 21.7673 18.4016 22.9898 18.4016C24.2124 18.4016 25.2072 17.4067 25.2072 16.1842C25.2072 14.9617 24.2124 13.9668 22.9898 13.9668ZM22.9898 16.9233C22.5818 16.9233 22.2507 16.5914 22.2507 16.1842C22.2507 15.7769 22.5818 15.4451 22.9898 15.4451C23.3978 15.4451 23.729 15.7769 23.729 16.1842C23.729 16.5914 23.3978 16.9233 22.9898 16.9233Z" fill="#4F4F4F"/><path d="M20.0354 11.0114C20.1463 11.0114 20.2594 10.9863 20.3651 10.9338L23.3216 9.45555C23.6867 9.27298 23.8345 8.82877 23.652 8.46364C23.4687 8.09851 23.0245 7.94994 22.6601 8.13324L19.7035 9.61151C19.3384 9.79407 19.1906 10.2383 19.3732 10.6034C19.5032 10.8621 19.7642 11.0114 20.0354 11.0114Z" fill="#4F4F4F"/><path d="M10.8338 9.4542L13.7903 10.9325C13.896 10.9849 14.0091 11.0101 14.1199 11.0101C14.3912 11.0101 14.6521 10.8608 14.7822 10.6013C14.9648 10.2362 14.8169 9.79198 14.4518 9.60942L11.4953 8.13116C11.1287 7.94785 10.6859 8.09716 10.5034 8.46155C10.3201 8.82742 10.4686 9.2709 10.8338 9.4542Z" fill="#4F4F4F"/><path d="M17.0776 21.3574C14.3214 21.3574 11.696 22.5252 9.87475 24.5601C9.60275 24.8646 9.62862 25.3317 9.9324 25.6037C10.2369 25.8765 10.7041 25.8498 10.9761 25.5461C12.5179 23.8232 14.7412 22.8357 17.0776 22.8357C19.4125 22.8357 21.6365 23.8232 23.1791 25.5461C23.3247 25.7094 23.5272 25.7922 23.7298 25.7922C23.9057 25.7922 24.0823 25.7301 24.2228 25.6037C24.5265 25.331 24.5524 24.8646 24.2804 24.5601C22.4577 22.5245 19.8331 21.3574 17.0776 21.3574Z" fill="#4F4F4F"/></svg><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#E33737"/><path d="M13.382 16.1842C13.382 14.9617 12.3872 13.9668 11.1647 13.9668C9.94214 13.9668 8.94727 14.9617 8.94727 16.1842C8.94727 17.4067 9.94214 18.4016 11.1647 18.4016C12.3872 18.4016 13.382 17.4067 13.382 16.1842ZM10.4255 16.1842C10.4255 15.7769 10.7574 15.4451 11.1647 15.4451C11.5719 15.4451 11.9038 15.7769 11.9038 16.1842C11.9038 16.5914 11.5719 16.9233 11.1647 16.9233C10.7574 16.9233 10.4255 16.5914 10.4255 16.1842Z" fill="white"/><path d="M22.9908 13.9668C21.7683 13.9668 20.7734 14.9617 20.7734 16.1842C20.7734 17.4067 21.7683 18.4016 22.9908 18.4016C24.2133 18.4016 25.2082 17.4067 25.2082 16.1842C25.2082 14.9617 24.2133 13.9668 22.9908 13.9668ZM22.9908 16.9233C22.5828 16.9233 22.2517 16.5914 22.2517 16.1842C22.2517 15.7769 22.5828 15.4451 22.9908 15.4451C23.3988 15.4451 23.73 15.7769 23.73 16.1842C23.73 16.5914 23.3988 16.9233 22.9908 16.9233Z" fill="white"/><path d="M20.0354 11.0114C20.1463 11.0114 20.2594 10.9863 20.3651 10.9338L23.3216 9.45555C23.6867 9.27298 23.8345 8.82877 23.652 8.46364C23.4687 8.09851 23.0245 7.94994 22.6601 8.13324L19.7035 9.61151C19.3384 9.79407 19.1906 10.2383 19.3732 10.6034C19.5032 10.8621 19.7642 11.0114 20.0354 11.0114Z" fill="white"/><path d="M10.8347 9.4542L13.7913 10.9325C13.8969 10.9849 14.01 11.0101 14.1209 11.0101C14.3922 11.0101 14.6531 10.8608 14.7832 10.6013C14.9657 10.2362 14.8179 9.79198 14.4528 9.60942L11.4963 8.13116C11.1296 7.94785 10.6869 8.09716 10.5043 8.46155C10.321 8.82742 10.4696 9.2709 10.8347 9.4542Z" fill="white"/><path d="M17.0776 21.3594C14.3214 21.3594 11.696 22.5272 9.87475 24.562C9.60275 24.8665 9.62862 25.3337 9.9324 25.6057C10.2369 25.8784 10.7041 25.8518 10.9761 25.548C12.5179 23.8251 14.7412 22.8376 17.0776 22.8376C19.4125 22.8376 21.6365 23.8251 23.1791 25.548C23.3247 25.7114 23.5272 25.7941 23.7298 25.7941C23.9057 25.7941 24.0823 25.7321 24.2228 25.6057C24.5265 25.3329 24.5524 24.8665 24.2804 24.562C22.4577 22.5265 19.8331 21.3594 17.0776 21.3594Z" fill="white"/></svg>'
        break
      case 25:
        buttonElement.innerHTML =
          '<button><svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.21289" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0959 12.9537C14.0959 11.7312 13.101 10.7363 11.8785 10.7363C10.656 10.7363 9.66113 11.7312 9.66113 12.9537C9.66113 14.1762 10.656 15.1711 11.8785 15.1711C13.101 15.1711 14.0959 14.1762 14.0959 12.9537ZM11.1394 12.9537C11.1394 12.5465 11.4713 12.2146 11.8785 12.2146C12.2858 12.2146 12.6177 12.5465 12.6177 12.9537C12.6177 13.361 12.2858 13.6928 11.8785 13.6928C11.4713 13.6928 11.1394 13.361 11.1394 12.9537ZM23.7032 10.7363C22.4807 10.7363 21.4858 11.7312 21.4858 12.9537C21.4858 14.1762 22.4807 15.1711 23.7032 15.1711C24.9257 15.1711 25.9206 14.1762 25.9206 12.9537C25.9206 11.7312 24.9257 10.7363 23.7032 10.7363ZM23.7032 13.6928C23.2952 13.6928 22.9641 13.361 22.9641 12.9537C22.9641 12.5465 23.2952 12.2146 23.7032 12.2146C24.1112 12.2146 24.4424 12.5465 24.4424 12.9537C24.4424 13.361 24.1112 13.6928 23.7032 13.6928ZM10.5882 22.8081C12.4102 20.7726 15.0356 19.6055 17.7911 19.6055C20.5473 19.6055 23.1719 20.7733 24.9939 22.8081C25.2659 23.1126 25.24 23.5798 24.9362 23.8518C24.7958 23.9782 24.6184 24.0402 24.4432 24.0402C24.2407 24.0402 24.0382 23.9575 23.8926 23.7941C22.3508 22.0712 20.1267 21.0837 17.7911 21.0837C15.4554 21.0837 13.2314 22.0712 11.6895 23.7941C11.4175 24.0979 10.9504 24.1245 10.6459 23.8518C10.3421 23.5798 10.3162 23.1126 10.5882 22.8081Z" fill="#4F4F4F"/></svg><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#AE563A"/><path d="M13.382 12.9557C13.382 11.7332 12.3872 10.7383 11.1647 10.7383C9.94214 10.7383 8.94727 11.7332 8.94727 12.9557C8.94727 14.1782 9.94214 15.1731 11.1647 15.1731C12.3872 15.1731 13.382 14.1782 13.382 12.9557ZM10.4255 12.9557C10.4255 12.5484 10.7574 12.2165 11.1647 12.2165C11.5719 12.2165 11.9038 12.5484 11.9038 12.9557C11.9038 13.3629 11.5719 13.6948 11.1647 13.6948C10.7574 13.6948 10.4255 13.3629 10.4255 12.9557Z" fill="white"/><path d="M22.9908 10.7383C21.7683 10.7383 20.7734 11.7332 20.7734 12.9557C20.7734 14.1782 21.7683 15.1731 22.9908 15.1731C24.2133 15.1731 25.2082 14.1782 25.2082 12.9557C25.2082 11.7332 24.2133 10.7383 22.9908 10.7383ZM22.9908 13.6948C22.5828 13.6948 22.2517 13.3629 22.2517 12.9557C22.2517 12.5484 22.5828 12.2165 22.9908 12.2165C23.3988 12.2165 23.73 12.5484 23.73 12.9557C23.73 13.3629 23.3988 13.6948 22.9908 13.6948Z" fill="white"/><path d="M17.0776 19.6055C14.3221 19.6055 11.6967 20.7726 9.87475 22.8081C9.60275 23.1126 9.62862 23.5798 9.9324 23.8518C10.2369 24.1245 10.7041 24.0979 10.9761 23.7941C12.5179 22.0712 14.7419 21.0837 17.0776 21.0837C19.4132 21.0837 21.6373 22.0712 23.1791 23.7941C23.3247 23.9575 23.5272 24.0402 23.7298 24.0402C23.9049 24.0402 24.0823 23.9782 24.2228 23.8518C24.5265 23.5798 24.5524 23.1126 24.2804 22.8081C22.4584 20.7733 19.8338 19.6055 17.0776 19.6055Z" fill="white"/></svg>'
        break
      case 50:
        buttonElement.innerHTML =
          '<svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.30664" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M11.9703 16.0656C13.1928 16.0656 14.1877 15.0708 14.1877 13.8483C14.1877 12.6257 13.1928 11.6309 11.9703 11.6309C10.7478 11.6309 9.75293 12.6257 9.75293 13.8483C9.75293 15.0708 10.7478 16.0656 11.9703 16.0656ZM11.9703 13.1091C12.3776 13.1091 12.7095 13.441 12.7095 13.8483C12.7095 14.2555 12.3776 14.5874 11.9703 14.5874C11.5631 14.5874 11.2312 14.2555 11.2312 13.8483C11.2312 13.441 11.5631 13.1091 11.9703 13.1091Z" fill="#4F4F4F"/><path d="M23.7965 11.6309C22.574 11.6309 21.5791 12.6257 21.5791 13.8483C21.5791 15.0708 22.574 16.0656 23.7965 16.0656C25.019 16.0656 26.0139 15.0708 26.0139 13.8483C26.0139 12.6257 25.019 11.6309 23.7965 11.6309ZM23.7965 14.5874C23.3892 14.5874 23.0574 14.2555 23.0574 13.8483C23.0574 13.441 23.3892 13.1091 23.7965 13.1091C24.2037 13.1091 24.5356 13.441 24.5356 13.8483C24.5356 14.2555 24.2037 14.5874 23.7965 14.5874Z" fill="#4F4F4F"/><path d="M25.2747 20.5H10.4921C10.0841 20.5 9.75293 20.8311 9.75293 21.2391C9.75293 21.6471 10.0841 21.9782 10.4921 21.9782H25.2747C25.6827 21.9782 26.0138 21.6471 26.0138 21.2391C26.0138 20.8311 25.6827 20.5 25.2747 20.5Z" fill="#4F4F4F"/></svg><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#333"/><path d="M11.1647 16.0656C12.3872 16.0656 13.382 15.0708 13.382 13.8483C13.382 12.6257 12.3872 11.6309 11.1647 11.6309C9.94214 11.6309 8.94727 12.6257 8.94727 13.8483C8.94727 15.0708 9.94214 16.0656 11.1647 16.0656ZM11.1647 13.1091C11.5719 13.1091 11.9038 13.441 11.9038 13.8483C11.9038 14.2555 11.5719 14.5874 11.1647 14.5874C10.7574 14.5874 10.4255 14.2555 10.4255 13.8483C10.4255 13.441 10.7574 13.1091 11.1647 13.1091Z" fill="white"/><path d="M22.9908 11.6309C21.7683 11.6309 20.7734 12.6257 20.7734 13.8483C20.7734 15.0708 21.7683 16.0656 22.9908 16.0656C24.2133 16.0656 25.2082 15.0708 25.2082 13.8483C25.2082 12.6257 24.2133 11.6309 22.9908 11.6309ZM22.9908 14.5874C22.5836 14.5874 22.2517 14.2555 22.2517 13.8483C22.2517 13.441 22.5836 13.1091 22.9908 13.1091C23.3981 13.1091 23.73 13.441 23.73 13.8483C23.73 14.2555 23.3981 14.5874 22.9908 14.5874Z" fill="white"/><path d="M24.469 20.502H9.6864C9.2784 20.502 8.94727 20.8331 8.94727 21.2411C8.94727 21.6491 9.2784 21.9802 9.6864 21.9802H24.469C24.877 21.9802 25.2081 21.6491 25.2081 21.2411C25.2081 20.8331 24.877 20.502 24.469 20.502Z" fill="white"/></svg>'
        break
      case 75:
        buttonElement.innerHTML =
          '<svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.39746" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M14.2795 12.9537C14.2795 11.7312 13.2846 10.7363 12.0621 10.7363C10.8396 10.7363 9.84473 11.7312 9.84473 12.9537C9.84473 14.1762 10.8396 15.1711 12.0621 15.1711C13.2846 15.1711 14.2795 14.1762 14.2795 12.9537ZM11.323 12.9537C11.323 12.5465 11.6549 12.2146 12.0621 12.2146C12.4694 12.2146 12.8012 12.5465 12.8012 12.9537C12.8012 13.361 12.4694 13.6928 12.0621 13.6928C11.6549 13.6928 11.323 13.361 11.323 12.9537Z" fill="#4F4F4F"/><path d="M23.8873 10.7363C22.6648 10.7363 21.6699 11.7312 21.6699 12.9537C21.6699 14.1762 22.6648 15.1711 23.8873 15.1711C25.1098 15.1711 26.1047 14.1762 26.1047 12.9537C26.1047 11.7312 25.1098 10.7363 23.8873 10.7363ZM23.8873 13.6928C23.48 13.6928 23.1482 13.361 23.1482 12.9537C23.1482 12.5465 23.48 12.2146 23.8873 12.2146C24.2946 12.2146 24.6264 12.5465 24.6264 12.9537C24.6264 13.361 24.2946 13.6928 23.8873 13.6928Z" fill="#4F4F4F"/><path d="M25.1215 19.794C24.8169 19.5213 24.3491 19.5479 24.0778 19.8516C22.536 21.5746 20.3127 22.562 17.9763 22.562C15.6406 22.562 13.4166 21.5746 11.8747 19.8516C11.602 19.5479 11.1356 19.5213 10.8311 19.794C10.5266 20.066 10.5014 20.5331 10.7734 20.8376C12.5954 22.8732 15.2208 24.0403 17.9763 24.0403C20.7325 24.0403 23.3579 22.8725 25.1791 20.8376C25.4511 20.5331 25.4252 20.066 25.1215 19.794Z" fill="#4F4F4F"/></svg><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#F3BE40"/><path d="M13.382 12.9537C13.382 11.7312 12.3872 10.7363 11.1647 10.7363C9.94214 10.7363 8.94727 11.7312 8.94727 12.9537C8.94727 14.1762 9.94214 15.1711 11.1647 15.1711C12.3872 15.1711 13.382 14.1762 13.382 12.9537ZM10.4255 12.9537C10.4255 12.5465 10.7574 12.2146 11.1647 12.2146C11.5719 12.2146 11.9038 12.5465 11.9038 12.9537C11.9038 13.361 11.5719 13.6929 11.1647 13.6929C10.7574 13.6929 10.4255 13.361 10.4255 12.9537Z" fill="white"/><path d="M22.9908 10.7363C21.7683 10.7363 20.7734 11.7312 20.7734 12.9537C20.7734 14.1762 21.7683 15.1711 22.9908 15.1711C24.2133 15.1711 25.2082 14.1762 25.2082 12.9537C25.2082 11.7312 24.2133 10.7363 22.9908 10.7363ZM22.9908 13.6929C22.5836 13.6929 22.2517 13.361 22.2517 12.9537C22.2517 12.5465 22.5836 12.2146 22.9908 12.2146C23.3981 12.2146 23.73 12.5465 23.73 12.9537C23.73 13.361 23.3981 13.6929 22.9908 13.6929Z" fill="white"/><path d="M24.223 19.794C23.9185 19.5213 23.4506 19.5479 23.1794 19.8516C21.6375 21.5746 19.4142 22.562 17.0778 22.562C14.7422 22.562 12.5181 21.5746 10.9763 19.8516C10.7036 19.5479 10.2372 19.5213 9.93266 19.794C9.62814 20.066 9.60301 20.5331 9.87501 20.8376C11.697 22.8732 14.3224 24.0403 17.0778 24.0403C19.8341 24.0403 22.4594 22.8725 24.2807 20.8376C24.5527 20.5331 24.5268 20.066 24.223 19.794Z" fill="white"/></svg>'
        break
      case 100:
        buttonElement.innerHTML =
          '<svg width="34" height="34" viewBox="0 0 35 34" fill="none"><rect x="1.30176" y="0.5" width="33" height="33" rx="4.5" stroke="#4F4F4F"/><path d="M23.7916 8.05273C22.5691 8.05273 21.5742 9.0476 21.5742 10.2701C21.5742 11.4926 22.5691 12.4875 23.7916 12.4875C25.0141 12.4875 26.009 11.4926 26.009 10.2701C26.009 9.0476 25.0141 8.05273 23.7916 8.05273ZM23.7916 11.0093C23.3836 11.0093 23.0525 10.6774 23.0525 10.2701C23.0525 9.86286 23.3836 9.531 23.7916 9.531C24.1996 9.531 24.5307 9.86286 24.5307 10.2701C24.5307 10.6774 24.1996 11.0093 23.7916 11.0093Z" fill="#4F4F4F"/><path d="M11.9654 12.4875C13.188 12.4875 14.1828 11.4926 14.1828 10.2701C14.1828 9.0476 13.188 8.05273 11.9654 8.05273C10.7429 8.05273 9.74805 9.0476 9.74805 10.2701C9.74805 11.4926 10.7429 12.4875 11.9654 12.4875ZM11.9654 9.531C12.3734 9.531 12.7046 9.86286 12.7046 10.2701C12.7046 10.6774 12.3734 11.0093 11.9654 11.0093C11.5574 11.0093 11.2263 10.6774 11.2263 10.2701C11.2263 9.86286 11.5574 9.531 11.9654 9.531Z" fill="#4F4F4F"/><path d="M25.2698 16.9219H10.4872C10.0784 16.9219 9.74805 17.253 9.74805 17.661C9.74805 22.1438 13.3957 25.7914 17.8785 25.7914C22.3613 25.7914 26.0089 22.1438 26.0089 17.661C26.0089 17.253 25.6785 16.9219 25.2698 16.9219ZM17.8785 24.3132C14.46 24.3132 11.6365 21.7218 11.2677 18.4001H24.4893C24.1204 21.7218 21.297 24.3132 17.8785 24.3132Z" fill="#4F4F4F"/></svg><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="5" fill="#3CA53E"/><path d="M22.9899 8.05273C21.7673 8.05273 20.7725 9.0476 20.7725 10.2701C20.7725 11.4926 21.7673 12.4875 22.9899 12.4875C24.2124 12.4875 25.2072 11.4926 25.2072 10.2701C25.2072 9.0476 24.2124 8.05273 22.9899 8.05273ZM22.9899 11.0093C22.5819 11.0093 22.2507 10.6774 22.2507 10.2701C22.2507 9.86286 22.5819 9.531 22.9899 9.531C23.3979 9.531 23.729 9.86286 23.729 10.2701C23.729 10.6774 23.3979 11.0093 22.9899 11.0093Z" fill="white"/><path d="M11.1656 12.4875C12.3882 12.4875 13.383 11.4926 13.383 10.2701C13.383 9.0476 12.3882 8.05273 11.1656 8.05273C9.94311 8.05273 8.94824 9.0476 8.94824 10.2701C8.94824 11.4926 9.94311 12.4875 11.1656 12.4875ZM11.1656 9.531C11.5736 9.531 11.9048 9.86286 11.9048 10.2701C11.9048 10.6774 11.5736 11.0093 11.1656 11.0093C10.7576 11.0093 10.4265 10.6774 10.4265 10.2701C10.4265 9.86286 10.7576 9.531 11.1656 9.531Z" fill="white"/><path d="M24.469 16.9219H9.6864C9.27766 16.9219 8.94727 17.253 8.94727 17.661C8.94727 22.1438 12.5949 25.7914 17.0777 25.7914C21.5605 25.7914 25.2081 22.1438 25.2081 17.661C25.2081 17.253 24.8777 16.9219 24.469 16.9219ZM17.0777 24.3132C13.6592 24.3132 10.8357 21.7218 10.4669 18.4001H23.6885C23.3197 21.7218 20.4962 24.3132 17.0777 24.3132Z" fill="white"/></svg>'
        break
    }

    return optionElement
  })

  const textareaElement = document.createElement("textarea")
  textareaElement.setAttribute("placeholder", _("form.text-placeholder", options?.locale))
  textareaElement.setAttribute("tabindex", "9201")
  contentElement.appendChild(textareaElement)

  const buttonsElement = document.createElement("ul")
  buttonsElement.setAttribute("class", "_q-buttons")
  contentElement.appendChild(buttonsElement)

  const cancelElement = document.createElement("li")
  buttonsElement.appendChild(cancelElement)

  const cancelButtonElement = document.createElement("button")
  cancelButtonElement.innerHTML = _("form.cancel", options?.locale)
  cancelButtonElement.setAttribute("tabindex", "9202")
  cancelElement.appendChild(cancelButtonElement)

  const sendElement = document.createElement("li")
  buttonsElement.appendChild(sendElement)

  const sendButtonElement = document.createElement("button")
  sendButtonElement.setAttribute("tabindex", "9203")
  sendButtonElement.disabled = true
  sendButtonElement.innerHTML =
    '<svg width="16" height="15" viewBox="0 0 16 15" fill="none"><path d="M15 3V9C15 10.1046 14.1046 11 13 11H5.82843C5.29799 11 4.78929 11.2107 4.41421 11.5858L2.70711 13.2929C2.07714 13.9229 1 13.4767 1 12.5858V3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3Z" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    _("form.send", options?.locale)
  sendElement.appendChild(sendButtonElement)

  const successElement = document.createElement("ul")
  successElement.setAttribute("class", "_q-success")
  contentElement.appendChild(successElement)

  const successTextElement = document.createElement("li")
  successTextElement.innerHTML = _("form.sending", options?.locale)
  successElement.appendChild(successTextElement)

  const successCloseElement = document.createElement("li")
  successElement.appendChild(successCloseElement)

  const successButtonElement = document.createElement("button")
  sendButtonElement.setAttribute("tabindex", "9204")
  successButtonElement.innerHTML =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11L11 1Z" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    _("form.close", options?.locale)
  successCloseElement.appendChild(successButtonElement)

  if (options?.supportURL) {
    const footerElement = document.createElement("div")
    footerElement.setAttribute("class", "_q-support-link")
    containerElement.appendChild(footerElement)

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", options.supportURL)
    linkElement.setAttribute("target", "_blank")
    linkElement.setAttribute("rel", "noopener noreferrer")
    linkElement.setAttribute("tabindex", "9205")
    linkElement.innerHTML = _("form.support", options.locale) + " ->"
    footerElement.appendChild(linkElement)
  }

  document.body.appendChild(containerElement)

  const dismissByKeyEvent = (event: KeyboardEvent) => {
    if (
      (event.key == "Escape" || event.key == "Esc" || event.keyCode == 27) &&
      document.activeElement?.tagName != "TEXTAREA"
    ) {
      event.preventDefault()
      dismiss()
      return false
    }
  }

  const dismiss = (): void => {
    window.removeEventListener("keydown", dismissByKeyEvent)

    containerElement.className += " _q-out"
    setTimeout(() => {
      containerElement.parentElement?.removeChild(containerElement)
    }, 500)

    options?.onDismiss?.(entryReference)
  }
  const send = (): void => {
    if (!selectedScore) return

    const text = textareaElement.value.trim()
    containerElement.className += " _q-sent" + (text.length == 0 ? " _q-no-text" : "")

    textareaElement.disabled = true

    post(collection, {
      score: selectedScore,
      text,
      user: options?.user,
      customAttributes: options?.customAttributes,
    })
      .then((newEntryReference) => {
        entryReference = newEntryReference

        successTextElement.innerHTML =
          '<svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M15 1L6.3738 9.62623C5.98325 10.0167 5.35008 10.0167 4.95956 9.62623L1 5.66663" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          _("form.sent", options?.locale)
      })
      .catch(() => {
        successTextElement.innerHTML = _("form.error", options?.locale)
      })
  }

  cancelButtonElement.onclick = dismiss
  successButtonElement.onclick = dismiss
  sendButtonElement.onclick = send
  closeElement.onclick = dismiss

  optionButtonElements.forEach((buttonElement, index) => {
    buttonElement.onclick = () => {
      optionElements.forEach((x) => (x.className = x.className.replace(" _q-selected", "")))
      optionElements[index].className += " _q-selected"
      selectedScore = scores[index]
      sendButtonElement.disabled = false
    }
  })

  setTimeout(() => {
    containerElement.className = containerElement.className.replace("_q-out", "")
    closeElement.focus()
  }, 1)

  window.addEventListener("keydown", dismissByKeyEvent)

  return {
    dismiss,
  }
}