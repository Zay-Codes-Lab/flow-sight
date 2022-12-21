import deepDiff from "deep-diff";

function extractAddressFromPath(state, path) {
    if (path[0] !== "accounts") {
        throw new Error("Path does not start with accounts");
    }
    if (path.length < 2) {
        throw new Error("Path does not have enough elements");
    }
    return state[path[0]][path[1]].address;
}

function extractCheckFromPath(state, path) {
    if (path[0] !== "accounts") {
        throw new Error("Path does not start with accounts");
    }
    if (path.length < 4) {
        throw new Error("Path does not have enough elements");
    }
    return state[path[0]][path[1]][path[2]][path[3]];
}

function convertDiffToHumanReadable(currentState, diff) {
    return {
        address: extractAddressFromPath(currentState, diff.path),
        checkName: extractCheckFromPath(currentState, diff.path).name,
        propertyChanged: diff.path[4],
        currentStateValue: diff.lhs,
        proposedStateValue: diff.rhs,
        humanReadableChange: "TODO",
    };
}

export function generateDiff(currentState, proposedState) {
    const generatedDiff = deepDiff.diff(currentState, proposedState);

    return generatedDiff.map((d) =>
        convertDiffToHumanReadable(currentState, d)
    );
}
