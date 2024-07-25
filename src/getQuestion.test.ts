import { getQuestion } from "./getQuestion"

describe("getQuestion", () => {
  const validCollection = "ci-test/web"

  it("should handle success", async () => {
    const question = await getQuestion(validCollection)
    expect(question.id).toEqual("web")
    expect(question.name).toEqual("Web?")
    expect(question.content.length).toBeGreaterThan(0)
  })

  it("should handle not found", async () => {
    try {
      await getQuestion("ci-test/does-not-exists")
    } catch (error) {
      expect((error as Error).message).toEqual("NotFound")
      return
    }
    fail("did not throw error")
  })

  it("should handle connection failure", async () => {
    try {
      await getQuestion(validCollection, { _remoteUrl: "https://does-not-exists.qualtive.io" })
    } catch (error) {
      // expected
      return
    }

    fail("did not throw error")
  })
})
