import * as qualtive from "qualtive-web"

let inlineRender: ReturnType<typeof qualtive.renderEnquiry> | null

async function present(collectionOrEnquiry: qualtive.Collection | qualtive.Enquiry) {
  const options = {
    darkMode: (document.getElementById("darkmode") as HTMLSelectElement).value as "auto",
    supportURL: (document.getElementById("supportURL") as HTMLInputElement).value,
    locale: (document.getElementById("locale") as HTMLInputElement).value,
    networking: (document.getElementById("networking") as HTMLSelectElement).value as "auto",
    metadataCollection: (document.getElementById("metadataCollection") as HTMLSelectElement).value as "nonPersonal",
    userTrackingConsent: (document.getElementById("userTrackingConsent") as HTMLSelectElement).value as "granted",
    previewToken: (document.getElementById("previewToken") as HTMLInputElement).value || null,
  }

  const presentInline = (document.getElementById("presentInline") as HTMLInputElement).checked
  if (presentInline) {
    let enquiry: qualtive.Enquiry
    if (typeof collectionOrEnquiry === "string" || Array.isArray(collectionOrEnquiry)) {
      enquiry = await qualtive.getEnquiry(collectionOrEnquiry, options)
    } else {
      enquiry = collectionOrEnquiry
    }
    inlineRender?.unmount()
    inlineRender = qualtive.renderEnquiry(
      enquiry,
      document.getElementById("qualtive-inline") as HTMLDivElement,
      options,
    )
  } else {
    qualtive.present(collectionOrEnquiry, {
      ...options,
      onDismiss: (result) => {
        if (!result) {
          console.info("Dismissed without a posting.")
          return
        }
        console.info("Dismissed with posting: ", result)
      },
    })
  }
}

document.querySelectorAll("*[data-collection]").forEach((button) => {
  ;(button as HTMLButtonElement).onclick = (e) => {
    e.preventDefault()
    const collection = button.getAttribute("data-collection")
    if (!collection) throw Error(`Missing collection on button: ${button}`)

    present(collection)
  }
})

document.querySelectorAll("*[data-static-enquiry]").forEach((button) => {
  ;(button as HTMLButtonElement).onclick = (e) => {
    e.preventDefault()

    present({
      id: 7927746166530402,
      slug: "how-does-the-client-web-library-work",
      name: "How does the client web library work for you?",
      pages: [
        {
          content: [
            {
              type: "score",
              scoreType: "smilies5",
              leadingText: null,
              trailingText: null,
            },
            {
              type: "text",
              placeholder: "Type here…",
            },
            {
              type: "attachments",
            },
            {
              type: "select",
              options: ["Option 1", "Option 2", "Option 3"],
              allowsCustomInput: true,
            },
            {
              type: "multiselect",
              options: ["Option A", "Option B", "Option C"],
            },
          ],
        },
      ],
      submittedPage: {
        content: [
          {
            type: "name",
          },
          {
            type: "userInput",
          },
          {
            type: "image",
            attachment: {
              url: "https://storage.googleapis.com/qualtive-user/feedback/attachments/qualtive/6216079997140992",
            },
          },
          {
            type: "title",
            text: "Så når du oss:",
          },
          {
            type: "body",
            text: "Vi svarar normal inom 48h. Vid brådskande ärenden är du välkommen att nå oss på telefon 123456673.",
          },
          {
            type: "confirmationText",
            text: "Tack, skickat!",
          },
        ],
      },
      container: {
        id: "qualtive",
        logo: null,
        isWhiteLabel: false,
      },
    } satisfies qualtive.Enquiry)
  }
})
