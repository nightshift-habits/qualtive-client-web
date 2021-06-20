import { parseCollection } from "./collection"

describe("parse", () => {
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
})
