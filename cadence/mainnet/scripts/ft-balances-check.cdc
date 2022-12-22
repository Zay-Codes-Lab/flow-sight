import FungibleToken from 0xf233dcee88fe0abe

pub fun main(addr: Address): AnyStruct {
  let flowSightAcct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "FT Balance changes to ".concat(flowSightAcct.address.toString())
  let balances : {String: UFix64} = {}
  flowSightResult["balances"] = balances
  flowSightAcct.forEachStored(fun (path: StoragePath, type: Type): Bool {
    if type.isSubtype(of: Type<@FungibleToken.Vault>()) {
      let vaultRef = flowSightAcct.borrow<&FungibleToken.Vault>(from: path) ?? panic("Could not borrow Balance reference to the Vault")
      var balancesObj = flowSightResult["balances"] as! {String: UFix64}?
      balancesObj!.insert(key: type.identifier, vaultRef.balance)
      flowSightResult["balances"] = balancesObj
    }
    return true
  })
  /*END CHECK*/

  return flowSightResult
}