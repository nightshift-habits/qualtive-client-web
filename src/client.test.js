import { _clientId, _hasTouch } from "./client"

describe("data", () => {
  it("should client id generate new", () => {
    const id = _clientId()
    expect(id.length).toBeGreaterThan(0)
    expect(id).toBe(_clientId())
  })

  it("should touch not have", () => {
    document.createEvent = (name) => {
      if (name == "TouchEvent") throw Error()
      return true
    }
    expect(_hasTouch()).toBe(false)
  })
  it("should touch have", () => {
    document.createEvent = () => {
      return true
    }
    expect(_hasTouch()).toBe(true)
  })
})
