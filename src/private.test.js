import { parseCollection, validateEntry, parseCustomAttributes, getClientId, hasTouch } from "./private"

describe("validation", () => {
  it("should catch parse collection failure", () => {
    // Invalid type
    expect(() => parseCollection(undefined)).toThrowError()
    expect(() => parseCollection(null)).toThrowError()
    expect(() => parseCollection(1)).toThrowError()
    expect(() => parseCollection(true)).toThrowError()
    expect(() => parseCollection(["abc", "123"])).toThrowError()
    expect(() => parseCollection({ abc: "123" })).toThrowError()

    // Invalid format
    expect(() => parseCollection("")).toThrowError()
    expect(() => parseCollection("container")).toThrowError()
    expect(() => parseCollection("container/")).toThrowError()
    expect(() => parseCollection("/")).toThrowError()
    expect(() => parseCollection("/question")).toThrowError()
    expect(() => parseCollection("container/question/")).toThrowError()
  })
  it("should parse collection successfully", () => {
    expect(parseCollection("container/question")).toEqual(["container", "question"])
    expect(parseCollection("container_-/question-")).toEqual(["container_-", "question-"])
  })

  it("should catch validate entry", () => {
    // Invalid type
    expect(() => validateEntry(undefined)).toThrowError()
    expect(() => validateEntry(null)).toThrowError()
    expect(() => validateEntry(1)).toThrowError()
    expect(() => validateEntry(true)).toThrowError()
    expect(() => validateEntry(["abc", "123"])).toThrowError()
    expect(() => validateEntry("abc")).toThrowError()

    // Invalid score
    expect(() =>
      validateEntry({
        score: -1,
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        score: 101,
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        score: "50",
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        score: true,
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        score: {},
      })
    ).toThrowError()

    // Invalid text
    expect(() =>
      validateEntry({
        score: 50,
        text: true,
      })
    ).toThrowError()

    // Invalid user
    expect(() =>
      validateEntry({
        score: 50,
        user: true,
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        score: 50,
        user: {
          id: true,
        },
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        score: 50,
        user: {
          id: 1,
          name: 123,
        },
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        score: 50,
        user: {
          id: 1,
          email: 123,
        },
      })
    ).toThrowError()

    // Invalid custom attributes
    expect(() =>
      validateEntry({
        score: 50,
        customAttributes: true,
      })
    ).toThrowError()
  })
  it("should validate entry successfully", () => {
    validateEntry({
      score: 50,
      text: "Hello world!",
      user: {
        id: 1,
        name: "Testsson",
        email: "dev",
      },
    })
  })

  it("should catch custom attributes failures", () => {
    expect(() =>
      parseCustomAttributes({
        obj: { abc: 123 },
        arr: [456],
        s: "Hello",
      })
    ).toThrowError()
  })
  it("should parse custom attributes successfully", () => {
    parseCustomAttributes(undefined)
    parseCustomAttributes(null)
    parseCustomAttributes({
      n: 1,
      b: false,
      s: "Hello",
      nothing: null,
    })
  })
})

describe("data", () => {
  it("should client id generate new", () => {
    const id = getClientId()
    expect(id.length).toBeGreaterThan(0)
    expect(id).toBe(getClientId())
  })

  it("should touch not have", () => {
    document.createEvent = (name) => {
      if (name == "TouchEvent") throw Error()
      return true
    }
    expect(hasTouch()).toBe(false)
  })
  it("should touch have", () => {
    document.createEvent = () => {
      return true
    }
    expect(hasTouch()).toBe(true)
  })
})