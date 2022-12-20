export function buildCurrentStateJson(authorizers) {
    const schema = { accounts: [] };
    for (let i = 0; i < authorizers.length; i++) {
        schema.accounts.push({ address: authorizers[i], checks: [] });
    }
    return schema;
}
