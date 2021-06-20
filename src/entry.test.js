import { validateEntry, _parseCustomAttributes } from "./entry"

describe("validation", () => {
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

    // Invalid content
    expect(() =>
      validateEntry({
        content: null,
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        content: [],
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        content: [
          {
            type: "score",
            value: -1,
          },
        ],
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        content: [
          {
            type: "score",
            value: 101,
          },
        ],
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        content: [
          {
            type: "score",
            value: "50",
          },
        ],
      })
    ).toThrowError()
    expect(() =>
      validateEntry({
        content: [
          {
            type: "text",
            value: true,
          },
        ],
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
      _parseCustomAttributes({
        obj: { abc: 123 },
        arr: [456],
        s: "Hello",
      })
    ).toThrowError()
  })
  it("should parse custom attributes successfully", () => {
    _parseCustomAttributes(undefined)
    _parseCustomAttributes(null)
    _parseCustomAttributes({
      n: 1,
      b: false,
      s: "Hello",
      nothing: null,
    })
  })
})
