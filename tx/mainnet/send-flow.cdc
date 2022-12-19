import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe

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
