import { post } from "./post"
import { Entry } from "./model"

describe("post", () => {
  const validCollection = "ci-test/web"
  const validEntry: Entry = {
    score: 50,
    text: "Hello world!",
    user: {
      id: "ci-web",
    },
    source: {
      webpageUrl: "https://qualtive.io/path/?query#hash",
    },
  }

  it("should handle success", async () => {
    const reference = await post(validCollection, validEntry)
    expect(reference.id).toBeGreaterThan(0)
  })

  it("should handle connection failure", async () => {
    try {
      await post(validCollection, validEntry, { _remoteUrl: "https://does-not-exists.qualtive.io" })
    } catch (error) {
      // expected
      return
    }

    fail("did not throw error")
  })
})
