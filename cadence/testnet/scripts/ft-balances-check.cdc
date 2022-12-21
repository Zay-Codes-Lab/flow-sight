import FungibleToken from 0x9a0766d93b6608b7

pub fun main(addr: Address): AnyStruct {
  let flowSightAcct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "Check FT Balances"
  let balances : [AnyStruct] = []
  flowSightResult["balances"] = balances
  flowSightAcct.forEachStored(fun (path: StoragePath, type: Type): Bool {
    if type.isSubtype(of: Type<@FungibleToken.Vault>()) {
      let vaultRef = flowSightAcct.borrow<&FungibleToken.Vault>(from: path) ?? panic("Could not borrow Balance reference to the Vault")
      var balancesObj = flowSightResult["balances"] as! [AnyStruct]?
      balancesObj!.append({"type": type.identifier, "value": vaultRef.balance})
      flowSightResult["balances"] = balancesObj
    }
    return true
  })
  /*END CHECK*/

  return flowSightResult
}