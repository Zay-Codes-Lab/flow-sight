import { program } from "commander";
import fs from "fs";
import fcl from "@onflow/fcl";
import { decode } from "@onflow/decode";
import { mapValuesToCode } from "@onflow/flow-cadut";
import { getCurrentState, dryRunTx } from "../index.js";

async function currentState(addresses, options) {
    // Setup FCL.
    fcl.config()
        .put(
            "accessNode.api",
            options.network === "mainnet"
                ? "https://rest-mainnet.onflow.org"
                : "https://rest-testnet.onflow.org"
        )
        .put("flow.network", options.network);

    const state = await getCurrentState(fcl, addresses);
    console.log(JSON.stringify(state, null, 2));
}

async function dryRun(cadenceFile, jsonArgs, addresses, options) {
    // Setup FCL.
    fcl.config()
        .put(
            "accessNode.api",
            options.network === "mainnet"
                ? "https://rest-mainnet.onflow.org"
                : "https://rest-testnet.onflow.org"
        )
        .put("flow.network", options.network);

    const txCode = fs.readFileSync(cadenceFile, "utf8");
    const parsedJsonArgs = JSON.parse(jsonArgs);
    const decodedArgs = await Promise.all(
        parsedJsonArgs.map(async (jsonArg) => await decode(jsonArg))
    );
    const args = await mapValuesToCode(txCode, decodedArgs);

    // Need a wallet with no broken contract resources(NFTs)
    await dryRunTx(fcl, txCode, args, addresses);
}

program
    .name("flow-sight")
    .description("CLI to interact with Flow Sight")
    .version("1.0.0");

program
    .command("current-state")
    .description("Return the current state based on the available checks.")
    .argument("<addresses...>", "list of addresses to check")
    .option("-n, --network <network>", "Flow network", "testnet")
    .action((addresses, options) => currentState(addresses, options));

program
    .command("dry-run")
    .description("Dry run the provided transaction.")
    .argument("<cadenceFile>", "Cadence file to dry run")
    .argument("<jsonArgs>", "JSON arguments for the transaction in FCL format")
    .argument("<addresses...>", "list of addresses to check")
    .option("-n, --network <network>", "Flow network", "testnet")
    .action((cadenceFile, jsonArgs, addresses, options) =>
        dryRun(cadenceFile, jsonArgs, addresses, options)
    );

program.parse();
