import type { EnquirySubmittedContentReviewLinks } from "../../../types"
import type { PostedEntry } from "../../types"
import type { _RenderingContextSubmitted } from "../types"
import { _renderReviewLinks, _textToCopy } from "./reviewLinks"

const content: EnquirySubmittedContentReviewLinks = {
  type: "reviewLinks",
  links: [
    {
      title: "Google Reviews",
      url: "https://example.com/google",
      logo: null,
      icon: null,
      reference: { type: "known", label: "googleReviews" },
    },
    {
      title: "Our site",
      url: "https://example.com/custom",
      logo: null,
      icon: null,
      reference: { type: "custom", id: 42 },
    },
  ],
}

function createEntry(texts: (string | null)[]): PostedEntry {
  return {
    id: 123,
    content: [],
    pages: [
      {
        content: [{ type: "title", text: "Title" }, ...texts.map((value) => ({ type: "text" as const, value }))],
      },
    ],
  }
}

function createContext(entry: PostedEntry, networking: jest.Mock): _RenderingContextSubmitted {
  return {
    containerId: "my-container",
    contentElement: document.createElement("div"),
    options: { locale: "sv-se", networking },
    enquiry: { id: 7 } as _RenderingContextSubmitted["enquiry"],
    previousPage: () => {},
    nextPage: () => {},
    setPage: () => {},
    invalidateCanSend: () => {},
    user: undefined,
    padding: ["0", "0", "0", "0"],
    entry,
    userInputScoreValue: 100,
  }
}

describe("textToCopy", () => {
  it("joins all non-empty text values", () => {
    expect(_textToCopy(createEntry(["First", null, "  ", " Second "]))).toBe("First\n\nSecond")
  })

  it("returns null without any text", () => {
    expect(_textToCopy(createEntry([null, ""]))).toBeNull()
  })
})

describe("renderReviewLinks", () => {
  const writeText = jest.fn(() => Promise.resolve())

  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
  })

  it("hides the copy button when the user wrote no text", () => {
    const element = _renderReviewLinks(createContext(createEntry([null]), jest.fn()), content)

    expect(element.querySelector("._q-review-links-copy")).toBeNull()
    expect(element.querySelector("._q-review-links-paste")).toBeNull()
    expect(element.querySelectorAll("a")).toHaveLength(2)
  })

  it("copies the text, shows the copied state and tracks it", () => {
    const networking = jest.fn(() => Promise.resolve({}))
    const element = _renderReviewLinks(createContext(createEntry(["Great stay"]), networking), content)

    const button = element.querySelector<HTMLButtonElement>("._q-review-links-copy")!
    expect(button.textContent).toBe("Kopiera min text")
    expect(element.querySelector("._q-review-links-paste")?.textContent).toBe("Klistra in på någon av följande:")

    button.click()

    expect(writeText).toHaveBeenCalledWith("Great stay")
    expect(button.classList.contains("_q-copied")).toBe(true)
    expect(button.textContent).toBe("Text kopierad!")
    expect(networking).toHaveBeenCalledWith(
      "POST",
      "https://user-api.qualtive.io/feedback/enquiries/7/review-link-events/",
      expect.objectContaining({ "X-Container": "my-container" }),
      { type: "textCopied", entryId: 123 },
    )
  })

  it("tracks which review link was opened", () => {
    const networking = jest.fn(() => Promise.resolve({}))
    const element = _renderReviewLinks(createContext(createEntry(["Great stay"]), networking), content)

    const links = element.querySelectorAll("a")
    links[0].dispatchEvent(new MouseEvent("click"))
    links[1].dispatchEvent(new MouseEvent("click"))

    expect(networking).toHaveBeenNthCalledWith(1, "POST", expect.any(String), expect.any(Object), {
      type: "reviewLinkOpened",
      link: { type: "known", label: "googleReviews" },
      entryId: 123,
    })
    expect(networking).toHaveBeenNthCalledWith(2, "POST", expect.any(String), expect.any(Object), {
      type: "reviewLinkOpened",
      link: { type: "custom", id: 42 },
      entryId: 123,
    })
  })

  it("ignores tracking failures", async () => {
    const networking = jest.fn(() => Promise.reject(new Error("Offline")))
    const element = _renderReviewLinks(createContext(createEntry(["Great stay"]), networking), content)

    element.querySelector<HTMLButtonElement>("._q-review-links-copy")!.click()
    await Promise.resolve()

    expect(networking).toHaveBeenCalledTimes(1)
  })
})
