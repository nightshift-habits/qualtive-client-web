import {
  Question,
  EntryContent,
  EntryReference,
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
import { _styles } from "./styles"
import { _renderPreviewScore } from "./previewScore"
import { _renderPreviewText } from "./previewText"
import { _renderPreviewSelect } from "./previewSelect"
import { _renderPreviewMultiselect } from "./previewMultiselect"
import { _renderPreviewAttachments } from "./previewAttachments"
import { Form, FormOptions, _InputRenderingContext, _PreviewRenderingContext } from "./model"

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/question-id`. Required.
 * @param options Optional options.
 * @returns Form. The presented form.
 */
export const present = (collection: string, options?: FormOptions): Form => {
  const [containerId] = _parseCollection(collection)

  let entryReference: EntryReference | null

  let content: EntryContent[] = []

  const styleElement = document.createElement("style")
  let computedStyle = _styles.core
  if (!options?.darkMode || options.darkMode == "auto") {
    computedStyle += "@media (prefers-color-scheme:dark){" + _styles.dark + "}"
  } else if (options?.darkMode == "always") {
    computedStyle += _styles.dark
  }
  styleElement.innerHTML = computedStyle
  document.head.appendChild(styleElement)

  const noClickElement = document.createElement("div")
  noClickElement.setAttribute("id", "_q-no-click")

  const containerElement = document.createElement("div")
  containerElement.setAttribute("id", "_q-container")
  containerElement.setAttribute("class", "_q-out")
  containerElement.style.maxWidth = options?.size == "wide" ? "640px" : "375px"
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
        containerElement,
        noClickElement,
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
