import HumanDiff from "human-object-diff";

// A = added
// R = removed
// C = changed
const humanDiff = new HumanDiff({
    dontHumanizePropertyNames: true,
    templates: {
        N: "A|NEWVALUE was added to FIELD",
        D: "R|OLDVALUE was removed from FIELD",
        E: "C|OLDVALUE was changed to NEWVALUE for FIELD",
        I: "A|NEWVALUE was inserted into FIELD",
        R: "R|OLDVALUE was removed in FIELD",
        AE: "C|OLDVALUE was changed to NEWVALUE in FIELD",
        NS: "A|FIELD was added",
        DS: "R|FIELD was removed",
        ES: "C|FIELD was changed",
        IS: "A|An item was inserted into FIELD",
        RS: "R|An item was remove in FIELD",
        AES: "C|An item was changed in FIELD",
    },
});

const sanitize = (humanReadable) => {
    return humanReadable
        .replace(/Capability/g, "")
        .replace(/A\.[a-z|A-Z|0-9]+\.|&/g, "")
        .replace(`was inserted into capabilities`, `capability was made public`)
}

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
                if (key === "key" || key === "name" || key === "error") {
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
                        generatedDiff.forEach((d) =>{
                            const operation = d.split('|')[0];
                            const message = d.split('|')[1];
                            diffs.push({
                                address: address,
                                checkReadable: check.name,
                                check: check.key,
                                propertyChanged: key,
                                operation: operation,
                                humanReadable: sanitize(message),
                            })
                        });
                    }
                } catch (e) {
                    console.error("Error while generating diff", e);
                }
            }
        }
    }
    return diffs;
}
