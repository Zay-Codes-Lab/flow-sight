import fcl from "@onflow/fcl";
import { dryRunTx, getChecks, getCurrentState } from "../index.js";
import types from "@onflow/types";
import fs from "fs";

// setup fcl to point to mainnet
fcl.config().put("accessNode.api", "https://rest-mainnet.onflow.org");

async function run() {
    const checks = getChecks();
    const state = await getCurrentState(fcl, ["0xf9f7a4ebaf29be6c"], checks);
    console.log(JSON.stringify(state, null, 2));
}

run();
