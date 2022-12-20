pub fun main(addr: Address): AnyStruct {
  let acct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "Check Public Path Capabilities"
  let capabilities: [AnyStruct] = []
  flowSightResult["capabilities"] = capabilities
  acct.forEachPublic(fun (path: PublicPath, type: Type): Bool {
    var capabilitiesObj = flowSightResult["capabilities"] as! [AnyStruct]?
    capabilitiesObj!.append({"type": type.identifier})
    flowSightResult["capabilities"] = capabilitiesObj
    return true
  })

  /*END CHECK*/
  return flowSightResult
}
