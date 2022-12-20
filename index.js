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

async function getNewState(fcl, authorizers, providedChecks, txScript, args) {
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
            //console.log(check.cadence)
            const codeRegex = /\/\*START CHECK\*\/[\s\S]*?\/\*END CHECK\*\//g;
            const checkCode = check.cadence.match(codeRegex)
            let curScript = txScript.replace('/*INSERT_CODE_HERE*/', checkCode)

            
            const importRegex = /^import\s+[^\n]+/gm
            const importsInCheck = check.cadence.match(importRegex)
            const importsInTransaction = curScript.match(importRegex)
            const uniqueImportsFromCheck = importsInCheck.filter(element => !importsInTransaction.includes(element))
            for(const uniqueImport of uniqueImportsFromCheck) {
                curScript = `${uniqueImport}\n` + curScript
            }

            const result = await fcl
                .send([
                    fcl.script(curScript),
                    fcl.args(args),
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
    
    const scriptCode = convertTxToScript(txCode, authorizers);

    const newState = await getNewState(fcl, authorizers, checks, scriptCode, args);

    return {
        currentState,
        newState
    }
}

export { getChecks, dryRunTx, getCurrentState };
