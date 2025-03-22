import * as qualtive from "qualtive-web"

let inlineRender: ReturnType<typeof qualtive.renderEnquiry> | null

function getOptions() {
  return {
    darkMode: (document.getElementById("darkmode") as HTMLSelectElement).value as "auto",
    supportURL: (document.getElementById("supportURL") as HTMLInputElement).value,
    locale: (document.getElementById("locale") as HTMLInputElement).value,
    networking: (document.getElementById("networking") as HTMLSelectElement).value as "auto",
    metadataCollection: (document.getElementById("metadataCollection") as HTMLSelectElement).value as "nonPersonal",
    userTrackingConsent: (document.getElementById("userTrackingConsent") as HTMLSelectElement).value as "granted",
    previewToken: (document.getElementById("previewToken") as HTMLInputElement).value || null,
  }
}

async function present(collectionOrEnquiry: qualtive.Collection | qualtive.Enquiry) {
  const options = getOptions()

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
    qualtive.presentEnquiry(collectionOrEnquiry, {
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

const staticEnquiry: qualtive.Enquiry = {
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
        linkURL: "https://qualtive.io",
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
}

document.querySelectorAll("*[data-static-enquiry]").forEach((button) => {
  ;(button as HTMLButtonElement).onclick = (e) => {
    e.preventDefault()

    present(staticEnquiry)
  }
})

document.querySelectorAll("*[data-static-enquiry-submitted]").forEach((button) => {
  ;(button as HTMLButtonElement).onclick = (e) => {
    e.preventDefault()

    const content1: qualtive.EntryContent[] = [
      { type: "score", scoreType: "smilies5", value: 100, leadingText: null, trailingText: null },
      {
        type: "text",
        value: "Works amazing!",
      },
    ]
    const content2: qualtive.EntryContent[] = [
      {
        type: "text",
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    ]

    inlineRender?.unmount()
    inlineRender = qualtive.renderEnquirySubmitted(
      staticEnquiry,
      {
        id: 123,
        pages: [{ content: content1 }, { content: content2 }],
        content: [...content1, ...content2],
      },
      document.getElementById("qualtive-inline") as HTMLDivElement,
      getOptions(),
    )
  }
})
