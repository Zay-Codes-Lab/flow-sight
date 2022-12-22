pub fun main(addr: Address): AnyStruct {
  let flowSightAcct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "Public access updates to account ".concat(flowSightAcct.address.toString())
  let capabilities: [String] = []
  flowSightResult["capabilities"] = capabilities
  flowSightAcct.forEachPublic(fun (path: PublicPath, type: Type): Bool {
    var capabilitiesObj = flowSightResult["capabilities"] as! [String]?
    capabilitiesObj!.append(type.identifier)
    flowSightResult["capabilities"] = capabilitiesObj
    return true
  })

  /*END CHECK*/
  return flowSightResult
}
