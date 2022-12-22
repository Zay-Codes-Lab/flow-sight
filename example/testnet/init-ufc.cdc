import ufcInt_NFT from 0x04625c28593d9408
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20
// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction initializes a user's collection to support a specific NFT
// 
// Collection Identifier: UFCStrike
//
// Version: 0.1.1

transaction {

  prepare(signer: AuthAccount) {
    if signer.borrow<&ufcInt_NFT.Collection>(from: /storage/ufcInt_NFTCollection) == nil {
      let collection <- ufcInt_NFT.createEmptyCollection()
      signer.save(<-collection, to: /storage/ufcInt_NFTCollection)
    }
    if (signer.getCapability<&ufcInt_NFT.Collection{ufcInt_NFT.ufcInt_NFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/ufcInt_NFTCollection).borrow() == nil) {
      signer.unlink(/public/ufcInt_NFTCollection)
      signer.link<&ufcInt_NFT.Collection{ufcInt_NFT.ufcInt_NFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/ufcInt_NFTCollection, target: /storage/ufcInt_NFTCollection)
    }
  }

}

