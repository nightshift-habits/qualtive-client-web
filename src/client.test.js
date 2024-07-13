import { _clientId, _hasTouch } from "./client"

describe("_clientId", () => {
  it("should generate new", () => {
    const id = _clientId()
    expect(id.length).toBeGreaterThan(0)
    expect(id).toBe(_clientId())
  })
  it("should generate new if consent granted", () => {
    const options = { userTrackingConsent: "granted" }
    const id = _clientId(options)
    expect(id.length).toBeGreaterThan(0)
    expect(id).toBe(_clientId(options))
  })
  it("should not return null if consent denied", () => {
    expect(_clientId({ userTrackingConsent: "denied" })).toBeUndefined()
  })
})

describe("_hasTouch", () => {
  it("should not have", () => {
    document.createEvent = (name) => {
      if (name == "TouchEvent") throw Error()
      return true
    }
    expect(_hasTouch()).toBe(false)
  })
  it("should have", () => {
    document.createEvent = () => {
      return true
    }
    expect(_hasTouch()).toBe(true)
  })
})
