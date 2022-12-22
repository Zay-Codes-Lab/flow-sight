import getChecks from "./src/checks/index.js";
import * as t from "@onflow/types";
import * as fclGlobal from "@onflow/fcl";
import { addCheckToState, buildStateJson } from "./src/schema/index.js";
import convertTxToScript from "./src/parser/index.js";
import { generateDiff } from "./src/diff/index.js";

const DEFAULT_NETWORK = "testnet";

async function getCurrentStates(fcl, addresses, providedChecks) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const currentState = buildStateJson(addresses);
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

async function getProposedState(fcl, address, providedChecks, txScript, args) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const currentState = buildStateJson([address]);
    // loop through all authorizers
    for (let account of currentState.accounts) {
        const { checks } = account;
        // loop through checks
        for (let check of providedChecks) {
            const codeRegex = /\/\*START CHECK\*\/[\s\S]*?\/\*END CHECK\*\//g;
            const checkCode = check.cadence.match(codeRegex);
            let curScript = txScript.replace("/*INSERT_CODE_HERE*/", checkCode);

            const importRegex = /^import\s+[^\n]+/gm;
            const importsInCheck = check.cadence.match(importRegex) || [];
            const importsInTransaction = curScript.match(importRegex) || [];
            const uniqueImportsFromCheck = importsInCheck.filter(
                (element) => !importsInTransaction.includes(element)
            );
            for (const uniqueImport of uniqueImportsFromCheck) {
                curScript = `${uniqueImport}\n` + curScript;
            }

            const result = await fcl
                .send([fcl.script(curScript), fcl.args(args), fcl.limit(1000)])
                .then(fcl.decode);
            addCheckToState(checks, check, result);
        }
    }

    return currentState.accounts;
}

async function dryRunTx(fcl, txCode, args, authorizers, providedChecks) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const addresses = [
        ...new Set([
            ...args
                .filter((arg) => arg.xform.label === "Address")
                .map((arg) => fcl.withPrefix(arg.value)),
            ...authorizers,
        ]),
    ];

    const currentStates = await getCurrentStates(
        fcl,
        addresses,
        providedChecks
    );

    const proposedStates = { accounts: [] };
    for (const address of addresses) {
        const scriptCode = convertTxToScript(
            txCode,
            authorizers,
            address,
            addresses
        );

        const proposedState = await getProposedState(
            fcl,
            address,
            providedChecks,
            scriptCode,
            args
        );
        proposedStates.accounts.push(...proposedState);
    }

    const diff = generateDiff(currentStates, proposedStates);

    return {
        diff,
        currentStates,
        proposedStates,
    };
}

if (typeof window !== "undefined") {
    window.flowSightFCL = fclGlobal;
    window.flowSightTypes = t;
    window.flowSightGetChecks = getChecks;
    window.flowSightGetCurrentStates = getCurrentStates;
    window.flowSightGetProposedState = getProposedState;
    window.flowSightDryRunTx = dryRunTx;
}

export { getChecks, dryRunTx, getCurrentStates, getProposedState };
