const fcl = require('@onflow/fcl')
const dryRunTx = require('./index').dryRunTx

const types = require('@onflow/types')

// setup fcl to point to mainnet
 fcl.config()
     .put('accessNode.api', 'https://access-mainnet-beta.onflow.org')

// readfile from process.argv[2]
const fs = require('fs')
const txCode = fs.readFileSync(process.argv[2], 'utf8')

async function run() {
    
    // get the types needed for the dryRunTx function
    const types = require('@onflow/types')

    // use the onflow/types library to create the arguments
    // for the dryRunTx function
    const args = [
        fcl.arg("100.0", types.UInt64),
        fcl.arg("0x54b9b6c046396b55", types.Address)
    ]

    await dryRunTx(fcl, txCode, args, ["0xcbbe67425da5f083"])
}

run()
