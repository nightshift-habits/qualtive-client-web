import { getEnquiry } from "./getEnquiry"

describe("getEnquiry", () => {
  const validCollection = "ci-test/web"

  it("should handle success", async () => {
    const question = await getEnquiry(validCollection)
    expect(question.id).toEqual(6290486614556672)
    expect(question.slug).toEqual("web")
    expect(question.name).toEqual("Web?")
    expect(question.pages.length).toBeGreaterThan(0)
    expect(question.pages[0].content.length).toBeGreaterThan(0)
    expect(question.submittedPage.content.length).toBeGreaterThan(0)
  })

  it("should handle not found", async () => {
    try {
      await getEnquiry("ci-test/does-not-exists")
    } catch (error) {
      expect((error as Error).message).toEqual("NotFound")
      return
    }
    fail("did not throw error")
  })

  it("should handle connection failure", async () => {
    try {
      await getEnquiry(validCollection, { _remoteUrl: "https://does-not-exists.qualtive.io" })
    } catch (error) {
      // expected
      return
    }

    fail("did not throw error")
  })
})
