import fcl from "@onflow/fcl";
import { getCurrentState } from "../index.js";

// setup fcl to point to mainnet
fcl.config()
    .put("accessNode.api", "https://rest-mainnet.onflow.org")
    .put("flow.network", "mainnet");

async function run() {
    const state = await getCurrentState(fcl, ["0xf9f7a4ebaf29be6c"]);
    console.log(JSON.stringify(state, null, 2));
}

run();
