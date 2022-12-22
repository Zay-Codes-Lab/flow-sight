import HumanDiff from "human-object-diff";
const humanDiff = new HumanDiff({
    dontHumanizePropertyNames: true,
    templates: {
        N: "NEWVALUE was added to FIELD",
        D: "OLDVALUE was removed from FIELD",
        E: "OLDVALUE was changed to NEWVALUE for FIELD",
        I: "NEWVALUE was inserted into FIELD",
        R: "OLDVALUE was removed in FIELD",
        AE: "OLDVALUE was changed to NEWVALUE in FIELD",
        NS: "FIELD was added",
        DS: "FIELD was removed",
        ES: "FIELD was changed",
        IS: "An item was inserted into FIELD",
        RS: "An item was remove in FIELD",
        AES: "An item was changed in FIELD",
    },
});

export function generateDiff(currentState, proposedState) {
    let diffs = [];
    for (const account of currentState.accounts) {
        const address = account.address;
        const proposedAccount = proposedState.accounts.find(
            (a) => a.address === address
        );

        for (const check of account.checks) {
            const key = check.key;
            const proposedCheck = proposedAccount.checks.find(
                (a) => a.key === key
            );

            for (const key of Object.keys(check)) {
                if (key === "key" || key === "name") {
                    continue;
                }
                try {
                    const generatedDiff = humanDiff.diff(
                        // HumanDiff doesn't like direct arrays, so we convert them to objects
                        Array.isArray(check[key])
                            ? { [key]: check[key] }
                            : check[key],
                        Array.isArray(proposedCheck[key])
                            ? { [key]: proposedCheck[key] }
                            : proposedCheck[key]
                    );
                    if (generatedDiff && generatedDiff.length > 0) {
                        generatedDiff.forEach((d) =>
                            diffs.push({
                                address: address,
                                checkReadable: check.name,
                                check: check.key,
                                propertyChanged: key,
                                humanReadable: d,
                            })
                        );
                    }
                } catch (e) {
                    console.error("Error while generating diff", e);
                }
            }
        }
    }
    return diffs;
}
