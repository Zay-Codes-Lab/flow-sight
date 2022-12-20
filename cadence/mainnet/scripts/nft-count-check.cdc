import NonFungibleToken from 0x1d7e57aa55817448

pub fun main(addr: Address): AnyStruct {
  let acct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "Check NFT Counts"
  let counts: [AnyStruct] = []
  flowSightResult["counts"] = counts
  acct.forEachStored(fun (path: StoragePath, type: Type): Bool {
    if type.isSubtype(of: Type<@AnyResource{NonFungibleToken.CollectionPublic}>()) {
      let collectionRef = acct.borrow<&AnyResource{NonFungibleToken.CollectionPublic}>(from: path) ?? panic("Could not borrow Collection reference.")
      if collectionRef.getIDs().length > 0 {
        var countsObj = flowSightResult["counts"] as! [AnyStruct]?
        countsObj!.append({"type": type.identifier, "value": collectionRef.getIDs().length})
        flowSightResult["counts"] = countsObj
      }
    }
    return true
  })
   /*END CHECK*/
  return flowSightResult
}
