pub fun main(addr: Address): AnyStruct {
  let flowSightAcct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "Check Private Path Capabilities"
  let capabilities: [AnyStruct] = []
  flowSightResult["capabilities"] = capabilities
  flowSightAcct.forEachPrivate(fun (path: PrivatePath, type: Type): Bool {
    var capabilitiesObj = flowSightResult["capabilities"] as! [AnyStruct]?
    capabilitiesObj!.append({"type": type.identifier})
    flowSightResult["capabilities"] = capabilitiesObj
    return true
  })
  /*END CHECK*/

  return flowSightResult
}
