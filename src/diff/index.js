import HumanDiff from "human-object-diff";
const humanDiff = new HumanDiff({
    dontHumanizePropertyNames: true,
    templates: {
        N: "NEWVALUE was added to FIELD:DOTPATH",
        D: "OLDVALUE was removed from FIELD:DOTPATH",
        E: "OLDVALUE was changed to NEWVALUE for FIELD:DOTPATH",
        I: "NEWVALUE was inserted into FIELD:DOTPATH",
        R: "OLDVALUE was removed in FIELD:DOTPATH",
        AE: "OLDVALUE was changed to NEWVALUE in FIELD:DOTPATH",
        NS: "FIELD was added:DOTPATH",
        DS: "FIELD was removed:DOTPATH",
        ES: "FIELD was changed:DOTPATH",
        IS: "An item was inserted into FIELD:DOTPATH",
        RS: "An item was remove in FIELD:DOTPATH",
        AES: "An item was changed in FIELD:DOTPATH",
    },
});

function convertDiffToHumanReadable(currentState, diff) {
    const [diffString, path] = diff.split(":");
    const parts = path.split(".");
    const accountsIndexString = parts[1];
    const accountsIndexParts = accountsIndexString.split("[");
    const accountsIndexStringWithoutBracket = accountsIndexParts[1].slice(0, 1);
    const accountsIndex = parseInt(accountsIndexStringWithoutBracket);
    const checksIndexString = parts[2];
    const checksIndexParts = checksIndexString.split("[");
    const checksIndexStringWithoutBracket = checksIndexParts[1].slice(0, 1);
    const checksIndex = parseInt(checksIndexStringWithoutBracket);
    const check = currentState.accounts[accountsIndex].checks[checksIndex];

    return {
        address: currentState.accounts[accountsIndex].address,
        checkReadable: check.name,
        check: check.key,
        propertyChanged: parts[3],
        humanReadable: diffString,
    };
}

export function generateDiff(currentState, proposedState) {
    const generatedDiff = humanDiff.diff(currentState, proposedState);
    if (generatedDiff) {
        return generatedDiff.map((d) =>
            convertDiffToHumanReadable(currentState, d)
        );
    } else {
        return [];
    }
}
