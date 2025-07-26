import { PaddingValue } from "../types"
import { _parsePadding } from "./utils"

describe("parsePadding", () => {
  it("should handle null input", () => {
    const result = _parsePadding(null)
    expect(result).toEqual(["0", "0", "0", "0"])
  })

  it("should handle undefined input", () => {
    const result = _parsePadding(undefined)
    expect(result).toEqual(["0", "0", "0", "0"])
  })

  it("should handle empty string", () => {
    const result = _parsePadding("" as PaddingValue)
    expect(result).toEqual(["0", "0", "0", "0"])
  })

  it("should handle whitespace-only string", () => {
    const result = _parsePadding("   " as PaddingValue)
    expect(result).toEqual(["0", "0", "0", "0"])
  })

  it("should handle single value (all sides same)", () => {
    const result = _parsePadding("10px")
    expect(result).toEqual(["10px", "10px", "10px", "10px"])
  })

  it("should handle two values (top/bottom, left/right)", () => {
    const result = _parsePadding("10px 20px")
    expect(result).toEqual(["10px", "20px", "10px", "20px"])
  })

  it("should handle three values (top, left/right, bottom)", () => {
    const result = _parsePadding("10px 20px 30px")
    expect(result).toEqual(["10px", "20px", "30px", "20px"])
  })

  it("should handle four values (top, right, bottom, left)", () => {
    const result = _parsePadding("10px 20px 30px 40px")
    expect(result).toEqual(["10px", "20px", "30px", "40px"])
  })

  it("should handle extra whitespace", () => {
    const result = _parsePadding("  10px   20px  " as PaddingValue)
    expect(result).toEqual(["10px", "20px", "10px", "20px"])
  })

  it("should handle multiple spaces between values", () => {
    const result = _parsePadding("10px    20px     30px")
    expect(result).toEqual(["10px", "20px", "30px", "20px"])
  })

  it("should handle more than four values (uses first four)", () => {
    const result = _parsePadding("10px 20px 30px 40px 50px 60px" as PaddingValue)
    expect(result).toEqual(["10px", "20px", "30px", "40px"])
  })

  it("should handle different units", () => {
    const result = _parsePadding("1rem 2em 3% 4px" as PaddingValue)
    expect(result).toEqual(["1rem", "2em", "3%", "4px"])
  })

  it("should handle zero values", () => {
    const result = _parsePadding("0")
    expect(result).toEqual(["0", "0", "0", "0"])
  })
})
