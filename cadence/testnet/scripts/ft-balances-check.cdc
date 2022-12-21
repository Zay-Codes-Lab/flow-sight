import FungibleToken from 0x9a0766d93b6608b7
import DapperUtilityCoin from 0x82ec283f88a62e65

pub fun main(addr: Address): AnyStruct {
  let flowSightAcct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*START CHECK*/
  flowSightResult["name"] = "Check FT Balances"
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