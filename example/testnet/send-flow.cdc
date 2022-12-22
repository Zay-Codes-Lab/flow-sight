import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

transaction(amount: UFix64, to: Address) {
  var temporaryVault: @FlowToken.Vault

  prepare(acct: AuthAccount) {
    let provider = acct.borrow<&FlowToken.Vault{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
    self.temporaryVault <- provider.withdraw(amount: amount) as! @FlowToken.Vault
  }

  execute {
    let recipient = getAccount(to)
    let receiverRef = recipient.getCapability(/public/flowTokenReceiver)
                    .borrow<&{FungibleToken.Receiver}>()
                    ?? panic("Could not borrow a reference to the FlowToken receiver")
    receiverRef.deposit(from: <-self.temporaryVault)
  }
}