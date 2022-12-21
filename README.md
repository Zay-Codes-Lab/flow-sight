# Flow Sight

## Onboarding new Checks

See example/checker.cdc for the template of your check.

## Supported Checks

| Check                           | Mainnet | Testnet |
| ------------------------------- | ------- | ------- |
| Check FT Balances               | X       | X       |
| Check NFT Counts                | X       | X       |
| Check Public Path Capabilities  | X       | X       |
| Check Private Path Capabilities | X       | X       |

### WIP Checks

-   NonFungible token inventory (what's there and where it is)

### Helpful commands

yarn run flow-sight dry-run ./example/init-ufc.cdc '[]' 0xf9f7a4ebaf29be6c -n mainnet
yarn run flow-sight dry-run ./example/send-flow.cdc '[{"type": "UInt64", "value": 0.00000001}, {"type": "Address", "value": "0x54b9b6c046396b55"}]' 0xf9f7a4ebaf29be6c -n mainnet
yarn run flow-sight dry-run ./example/move-topshot.cdc '[{"type": "Address", "value": "0x85712baf7934898c"}, {"type": "UInt64", "value": 7576979}]' 0xf9f7a4ebaf29be6c -n mainnet

