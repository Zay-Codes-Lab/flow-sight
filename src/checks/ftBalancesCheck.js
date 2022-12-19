const check = () => {
  return `
    flowSightResult["name"] = "Check FT Balances"
    let balances : {String: UFix64} = {}
    flowSightResult["balances"] = balances

    acct.forEachStored(fun (path: StoragePath, type: Type): Bool {
      if type.isSubtype(of: Type<@FungibleToken.Vault>()) {
        
        let vaultRef = acct.borrow<&FungibleToken.Vault>(from: path)
        ?? panic("Could not borrow Balance reference to the Vault")
        
        var balancesObj = flowSightResult["balances"] as! {String: UFix64}?
        balancesObj!.insert(key: type.identifier, vaultRef.balance)
        flowSightResult["balances"] = balancesObj
      }
      return true
    })
  `
}

const imports = () => {
  return `
  import FungibleToken from 0xf233dcee88fe0abe
  `
}

export default {
  'check' : check,
  'imports' : imports
}