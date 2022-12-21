import getChecks from "./src/checks/index.js";
import * as t from "@onflow/types";
import * as fclGlobal from "@onflow/fcl";
import { addCheckToState, buildStateJson } from "./src/schema/index.js";
import convertTxToScript from "./src/parser/index.js";
import { generateDiff } from "./src/diff/index.js";

const DEFAULT_NETWORK = "testnet";

async function getCurrentState(fcl, authorizers, providedChecks) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const currentState = buildStateJson(authorizers);
    // loop through all authorizers
    for (let account of currentState.accounts) {
        const { address, checks } = account;
        // loop through checks
        for (let check of providedChecks) {
            const result = await fcl
                .send([
                    fcl.script(check.cadence),
                    fcl.args([fcl.arg(fcl.withPrefix(address), t.Address)]),
                    fcl.limit(1000),
                ])
                .then(fcl.decode);
            addCheckToState(checks, check, result);
        }
    }

    return currentState;
}

async function getProposedState(
    fcl,
    authorizers,
    providedChecks,
    txScript,
    args
) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const currentState = buildStateJson(authorizers);
    // loop through all authorizers
    for (let account of currentState.accounts) {
        const { address, checks } = account;
        // loop through checks
        for (let check of providedChecks) {
            const codeRegex = /\/\*START CHECK\*\/[\s\S]*?\/\*END CHECK\*\//g;
            const checkCode = check.cadence.match(codeRegex);
            let curScript = txScript.replace("/*INSERT_CODE_HERE*/", checkCode);

            const importRegex = /^import\s+[^\n]+/gm;
            const importsInCheck = check.cadence.match(importRegex);
            const importsInTransaction = curScript.match(importRegex);
            if (importsInCheck) {
                const uniqueImportsFromCheck = importsInCheck.filter(
                    (element) => !importsInTransaction.includes(element)
                );
                for (const uniqueImport of uniqueImportsFromCheck) {
                    curScript = `${uniqueImport}\n` + curScript;
                }
            }

            const result = await fcl
                .send([fcl.script(curScript), fcl.args(args), fcl.limit(1000)])
                .then(fcl.decode);
            addCheckToState(checks, check, result);
        }
    }

    return currentState;
}

async function dryRunTx(fcl, txCode, args, authorizers, providedChecks) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const currentState = await getCurrentState(
        fcl,
        authorizers,
        providedChecks
    );

    const scriptCode = convertTxToScript(txCode, authorizers);

    const proposedState = await getProposedState(
        fcl,
        authorizers,
        providedChecks,
        scriptCode,
        args
    );

    const diff = generateDiff(currentState, proposedState);

    return {
        diff,
        currentState,
        proposedState,
    };
}

if (typeof window !== "undefined") {
    window.flowSightFCL = fclGlobal;
    window.flowSightTypes = t;
    window.flowSightGetChecks = getChecks;
    window.flowSightGetCurrentState = getCurrentState;
    window.flowSightGetProposedState = getProposedState;
    window.flowSightDryRunTx = dryRunTx;
}

export { getChecks, dryRunTx, getCurrentState, getProposedState };
