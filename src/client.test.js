import { getClientId, hasTouch } from "./client"

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
