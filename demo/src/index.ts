import * as qualtive from "qualtive-web"

document.querySelectorAll("*[data-collection]").forEach((button) => {
  ;(button as HTMLButtonElement).onclick = (e) => {
    e.preventDefault()
    const collection = button.getAttribute("data-collection")
    if (!collection) throw Error(`Missing collection on button: \(button)`)

    qualtive.present(collection)
  }
})
