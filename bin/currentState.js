import fcl from "@onflow/fcl";
import { getCurrentState } from "../index.js";

// setup fcl to point to mainnet
fcl.config()
    .put("accessNode.api", "https://rest-mainnet.onflow.org")
    .put("flow.network", "mainnet");

async function run() {
    const state = await getCurrentState(fcl, process.argv.splice(2));
    console.log(JSON.stringify(state, null, 2));
}

run();
