export function buildStateJson(authorizers) {
    const schema = { accounts: [] };
    for (let i = 0; i < authorizers.length; i++) {
        schema.accounts.push({ address: authorizers[i], checks: [] });
    }
    return schema;
}

export function addCheckToState(checks, check, checkResult) {
    if (checkResult.error) {
        checks.push({
            key: check.name,
            error: checkResult.error,
        });
    } else {
        checks.push({
            ...checkResult.result,
            key: check.name,
            error: undefined,
        });
    }
}
