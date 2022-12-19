import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
pub fun main(amount: UFix64, to: Address): AnyStruct {
        let acct = getAuthAccount(0xcbbe67425da5f083)
  
    let provider = acct.borrow<&FlowToken.Vault{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
      var temporaryVault: @FlowToken.Vault <- provider.withdraw(amount: amount) as! @FlowToken.Vault
  
    let recipient = getAccount(to)
    let receiverRef = recipient.getCapability(/public/flowTokenReceiver)
                    .borrow<&{FungibleToken.Receiver}>()
                    ?? panic("Could not borrow a reference to the FlowToken receiver")
    receiverRef.deposit(from: <-temporaryVault)
  let flowSightResult: {String: AnyStruct} = {}
/*INSERT_CODE_HERE*/
 return flowSightResult
}