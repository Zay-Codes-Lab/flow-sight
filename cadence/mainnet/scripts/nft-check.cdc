import NonFungibleToken from 0x1d7e57aa55817448

pub fun main(addr: Address): AnyStruct {
  let flowSightAcct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "NFT Count changes to ".concat(flowSightAcct.address.toString())
  let counts: {String: [UInt64]} = {}
  flowSightResult["tokens"] = counts
  flowSightAcct.forEachStored(fun (path: StoragePath, type: Type): Bool {
    if type.isSubtype(of: Type<@AnyResource{NonFungibleToken.CollectionPublic}>()) {
      let collectionRef = flowSightAcct.borrow<&AnyResource{NonFungibleToken.CollectionPublic}>(from: path) ?? panic("Could not borrow Collection reference.")
      if collectionRef.getIDs().length > 0 {
        var countsObj = flowSightResult["tokens"] as! {String: [UInt64]}?
        countsObj!.insert(key: type.identifier, collectionRef.getIDs())
        flowSightResult["tokens"] = countsObj
      }
    }
    return true
  })
   /*END CHECK*/
  return flowSightResult
}
