import UFC_NFT from 0x329feb3ab062d289
import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448
// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction initializes a user's collection to support a specific NFT
// 
// Collection Identifier: UFCStrike
//
// Version: 0.1.1

transaction {

  prepare(signer: AuthAccount) {
    if signer.borrow<&UFC_NFT.Collection>(from: /storage/UFC_NFTCollection) == nil {
      let collection <- UFC_NFT.createEmptyCollection()
      signer.save(<-collection, to: /storage/UFC_NFTCollection)
    }
    if (signer.getCapability<&UFC_NFT.Collection{UFC_NFT.UFC_NFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/UFC_NFTCollection).borrow() == nil) {
      signer.unlink(/public/UFC_NFTCollection)
      signer.link<&UFC_NFT.Collection{UFC_NFT.UFC_NFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/UFC_NFTCollection, target: /storage/UFC_NFTCollection)
    }
  }

}