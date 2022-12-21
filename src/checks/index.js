import CHECKS from "../generated/cadenceChecks.js";

function getChecks(network = "testnet", filters = undefined) {
    return CHECKS[network].filter((check) =>
        filters ? filters.includes(check.name) : true
    );
}

export default getChecks;
