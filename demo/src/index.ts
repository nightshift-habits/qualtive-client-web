import * as qualtive from "qualtive-web"

document.querySelectorAll("*[data-collection]").forEach((button) => {
  ;(button as HTMLButtonElement).onclick = (e) => {
    e.preventDefault()
    const collection = button.getAttribute("data-collection")
    if (!collection) throw Error(`Missing collection on button: ${button}`)

    qualtive.present(collection, {
      darkMode: (document.getElementById("darkmode") as HTMLSelectElement).value as "auto",
      supportURL: (document.getElementById("supportURL") as HTMLInputElement).value,
      locale: (document.getElementById("locale") as HTMLInputElement).value,
      networking: (document.getElementById("networking") as HTMLSelectElement).value as "auto",
    })
  }
})
