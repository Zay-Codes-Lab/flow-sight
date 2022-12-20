// Your imports here...

// NOTE: `addr` must be provided as the first argument.
pub fun main(addr: Address): AnyStruct {
  let acct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  flowSightResult["name"] = "..." // Name of your check

  // Your code here...

  // Must return the flowSightResult at the end.
  return flowSightResult
}