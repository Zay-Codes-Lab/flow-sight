// Your imports here...

// NOTE: `addr` must be provided as the first argument.
pub fun main(addr: Address): AnyStruct {
  // NOTE: These variables are required for the Flow Sight integration.  Do not remove or edit them.
  let flowSightAcct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  flowSightResult["name"] = "..." // Name of your check

  /*START CHECK*/

  /*END CHECK*/
  return flowSightResult
}