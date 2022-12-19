import fcl from '@onflow/fcl'
import { dryRunTx } from './index.js'
import types from '@onflow/types'
import fs from 'fs'


// setup fcl to point to mainnet
 fcl.config()
     .put('accessNode.api', 'https://rest-mainnet.onflow.org')

// readfile from process.argv[2]
const txCode = fs.readFileSync(process.argv[2], 'utf8')

async function run() {
    
    // use the onflow/types library to create the arguments
    // for the dryRunTx function
    const args = [
        fcl.arg("0.00000001", types.UInt64),
        fcl.arg("0x54b9b6c046396b55", types.Address)
    ]

    await dryRunTx(fcl, txCode, args, ["0xcbbe67425da5f083"])
}

run()
