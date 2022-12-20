import fs from "fs";

async function readCadenceScripts(network = "testnet") {
    try {
        return await fs.promises.readdir(`./cadence/${network}/scripts`);
    } catch (err) {
        console.error("Error occurred while reading directory!", err);
    }
}

async function getChecks(network = "testnet") {
    const files = await readCadenceScripts(network);
    const checks = [];
    for (let file of files) {
        const code = await fs.promises.readFile(
            `./cadence/${network}/scripts/${file}`,
            "utf8"
        );
        checks.push({
            name: file.split(".")[0],
            cadence: code,
        });
    }
    return checks;
}

export default getChecks;
