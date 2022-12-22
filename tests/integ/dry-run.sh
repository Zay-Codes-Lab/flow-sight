#!/bin/bash

# Mainnet tests
# Should run without error
yarn run flow-sight dry-run ./example/mainnet/init-ufc.cdc '[]' 0xf9f7a4ebaf29be6c -n mainnet -d
[ $? -eq 0 ] || exit 1

# Should run without error
yarn run flow-sight dry-run ./example/mainnet/send-flow.cdc '[{"type": "UInt64", "value": 0.00000001}, {"type": "Address", "value": "0x54b9b6c046396b55"}]' 0xf9f7a4ebaf29be6c -n mainnet -d
[ $? -eq 0 ] || exit 1

# Should run without error
yarn run flow-sight dry-run ./example/mainnet/move-topshot.cdc '[{"type": "Address", "value": "0x85712baf7934898c"}, {"type": "UInt64", "value": 7576979}]' 0xf9f7a4ebaf29be6c -n mainnet -d
[ $? -eq 0 ] || exit 1

# Testnet tests
# Should run without error
yarn run flow-sight dry-run ./example/testnet/init-ufc.cdc '[]' 0x1d3491a985275270 -n testnet -d
[ $? -eq 0 ] || exit 1

# Should run without error
yarn run flow-sight dry-run ./example/testnet/send-flow.cdc '[{"type": "UInt64", "value": 0.00000001}, {"type": "Address", "value": "0x32f71e1e531cd04f"}]' 0x1d3491a985275270 -n testnet -d
[ $? -eq 0 ] || exit 1

# Should run without error
yarn run flow-sight dry-run ./example/testnet/move-topshot.cdc '[{"type": "Address", "value": "0x1de475923869dff4"}, {"type": "UInt64", "value": 5989779}]' 0x36def9812628105f -n testnet -d
[ $? -eq 0 ] || exit 1

