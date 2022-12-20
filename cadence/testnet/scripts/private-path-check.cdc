pub fun main(addr: Address): AnyStruct {
  let acct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  flowSightResult["name"] = "Check Private Path Capabilities"
  let capabilities: [AnyStruct] = []
  flowSightResult["capabilities"] = capabilities
  acct.forEachPrivate(fun (path: PrivatePath, type: Type): Bool {
    var capabilitiesObj = flowSightResult["capabilities"] as! [AnyStruct]?
    capabilitiesObj!.append({"type": type.identifier})
    flowSightResult["capabilities"] = capabilitiesObj
    return true
  })

  return flowSightResult
}
