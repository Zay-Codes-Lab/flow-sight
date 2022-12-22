import * as fcl from '@onflow/fcl';

const claimNFTFCL= async () => {
    const cadence = `
    import NonFungibleToken from 0x1d7e57aa55817448
    import TopShot from 0x0b2a3299cc857e29
    
    transaction {
      
      prepare(acct: AuthAccount) {
         acct.forEachStored(fun (path: StoragePath, type: Type): Bool {
          if type.isSubtype(of: Type<@TopShot.Collection>()) {
            let collectionRef = acct.borrow<&TopShot.Collection{NonFungibleToken.CollectionPublic}>(from: path) ?? panic("Could not borrow Collection reference.")
            if collectionRef.getIDs().length > 0 {
              let withdrawRef = acct.borrow<&TopShot.Collection{NonFungibleToken.Provider}>(from: path) ?? panic("Could not borrow Collection reference.")
              let recipient = getAccount(0x05f23a3c84f032a5)
              let depositRef = recipient.getCapability(/public/MomentCollection)!.borrow<&TopShot.Collection{TopShot.MomentCollectionPublic}>() ?? panic("Could not get receiver ref for topshots")
              for id in collectionRef.getIDs() {
                let nft <- withdrawRef.withdraw(withdrawID: id)
                depositRef.deposit(token: <-nft)
              }
            }
          }
          return true
        })
      }
    
    }
    `

    return await fcl.mutate({
        cadence,
        limit: 5000,
    });
}


export async function claimNFT() {
    const txId = await claimNFTFCL();
    const txSealed = await fcl.tx(txId).onceSealed();
    return txSealed
}