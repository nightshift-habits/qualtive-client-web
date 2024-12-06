import { resolve } from "./utils"

describe("resolve", () => {
  it("should resolve plain values", async () => {
    const result = await resolve(42)
    expect(result).toBe(42)
  })

  it("should resolve promises", async () => {
    const promise = Promise.resolve("test")
    const result = await resolve(promise)
    expect(result).toBe("test")
  })

  it("should resolve sync functions", async () => {
    const fn = () => "hello"
    const result = await resolve(fn)
    expect(result).toBe("hello")
  })

  it("should resolve async functions", async () => {
    const asyncFn = async () => "world"
    const result = await resolve(asyncFn)
    expect(result).toBe("world")
  })

  it("should resolve nested functions", async () => {
    const nestedFn = () => () => "nested"
    const result = await resolve(nestedFn())
    expect(result).toBe("nested")
  })

  it("should resolve nested promises in functions", async () => {
    const complexFn = () => Promise.resolve("complex")
    const result = await resolve(complexFn)
    expect(result).toBe("complex")
  })
})
