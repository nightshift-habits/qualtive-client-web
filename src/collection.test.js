import { _parseCollection } from "./collection"

describe("parse", () => {
  it("should catch parse collection failure", () => {
    // Invalid type
    expect(() => _parseCollection(undefined)).toThrowError()
    expect(() => _parseCollection(null)).toThrowError()
    expect(() => _parseCollection(1)).toThrowError()
    expect(() => _parseCollection(true)).toThrowError()
    expect(() => _parseCollection({ abc: "123" })).toThrowError()

    // Invalid format
    expect(() => _parseCollection("")).toThrowError()
    expect(() => _parseCollection("container")).toThrowError()
    expect(() => _parseCollection("container/")).toThrowError()
    expect(() => _parseCollection("/")).toThrowError()
    expect(() => _parseCollection("/question")).toThrowError()
    expect(() => _parseCollection("container/question/")).toThrowError()
  })
  it("should parse collection successfully", () => {
    expect(_parseCollection("container/question")).toEqual(["container", "question"])
    expect(_parseCollection("container_-/question-")).toEqual(["container_-", "question-"])
    expect(_parseCollection(["container_-", "question-"])).toEqual(["container_-", "question-"])
  })
})
