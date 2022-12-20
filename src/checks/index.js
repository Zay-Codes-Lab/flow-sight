import CHECKS from "../generated/cadenceChecks.js";

async function getChecks(network = "testnet") {
    return CHECKS[network];
}

export default getChecks;
