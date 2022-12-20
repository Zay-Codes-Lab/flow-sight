import getChecks from "./src/checks/index.js";
import t from "@onflow/types";
import { buildCurrentStateJson } from "./src/schema/index.js";
import convertTxToScript from "./src/parser/index.js";

const DEFAULT_NETWORK = "testnet";

async function getCurrentState(fcl, authorizers, providedChecks) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const currentState = buildCurrentStateJson(authorizers);
    // loop through all authorizers
    for (let account of currentState.accounts) {
        const { address, checks } = account;
        // loop through checks
        for (let check of providedChecks) {
            const result = await fcl
                .send([
                    fcl.script(check.cadence),
                    fcl.args([fcl.arg(address, t.Address)]),
                    fcl.limit(1000),
                ])
                .then(fcl.decode);

            checks.push(result);
        }
    }

    return currentState;
}

async function dryRunTx(fcl, txCode, args, authorizers) {
    const checks = await getChecks(
        await fcl.config().get("flow.network", DEFAULT_NETWORK)
    );

    const currentState = await getCurrentState(fcl, authorizers, checks);

    // run convertTxToScript and get the updated script code
    const scriptCode = convertTxToScript(txCode, authorizers);

    console.log(scriptCode);

    //const newState =

    // compare oldState and newState

    // print scriptCode
    //console.log(scriptCode)

    // run scriptCode and store the result
    /*const result = await fcl
        .send([
            fcl.script(scriptCode),
            fcl.args(args),
            fcl.limit(1000),
        ])
        .then(fcl.decode)
        */
}

export { getChecks, dryRunTx, getCurrentState };
