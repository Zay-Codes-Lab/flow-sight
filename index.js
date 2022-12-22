import getChecks from "./src/checks/index.js";
import * as t from "@onflow/types";
import * as fclGlobal from "@onflow/fcl";
import { resolveArguments } from "@onflow/flow-cadut";
import { addCheckToState, buildStateJson } from "./src/schema/index.js";
import convertTxToScript from "./src/parser/index.js";
import { generateDiff } from "./src/diff/index.js";

const DEFAULT_NETWORK = "testnet";

async function runScript(fcl, script, args) {
    try {
        const result = await fcl
            .send([fcl.script(script), fcl.args(args), fcl.limit(1000)])
            .then(fcl.decode);
        return { result, error: undefined };
    } catch (err) {
        return { result: undefined, error: err };
    }
}

async function getCurrentState(fcl, address, providedChecks) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const checks = [];
    // loop through checks
    for (let check of providedChecks) {
        const result = await runScript(fcl, check.cadence, [
            fcl.arg(fcl.withPrefix(address), t.Address),
        ]);
        addCheckToState(checks, check, result);
    }

    return checks;
}

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
        checks.push(...(await getCurrentState(fcl, address, providedChecks)));
    }

    return currentState;
}

async function getProposedState(fcl, providedChecks, txScript, args) {
    if (!providedChecks) {
        providedChecks = await getChecks(
            await fcl.config().get("flow.network", DEFAULT_NETWORK)
        );
    }

    const checks = [];
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

        const result = await runScript(fcl, curScript, args);
        addCheckToState(checks, check, result);
    }

    return checks;
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

    let currentStates = buildStateJson(addresses);
    let proposedStates = buildStateJson(addresses);

    for (let i = 0; i < addresses.length; i++) {
        // First, we run the converted script code to see if it even works.
        // If it does, we will continue to run the checks.
        // Else, we error out and return the error.
        const scriptCode = convertTxToScript(
            txCode,
            authorizers,
            addresses[i],
            addresses
        );

        const result = await runScript(fcl, scriptCode, args);

        if (result.error) {
            return { error: result.error };
        }

        currentStates.accounts[i].checks.push(
            ...(await getCurrentState(fcl, addresses[i], providedChecks))
        );

        proposedStates.accounts[i].checks.push(
            ...(await getProposedState(fcl, providedChecks, scriptCode, args))
        );
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
    window.flowSightResolveArguments = resolveArguments;
}

export { getChecks, dryRunTx, getCurrentStates, getProposedState };
