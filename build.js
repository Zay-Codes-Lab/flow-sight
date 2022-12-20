import path from "path";
import fs from "fs";
const __dirname = path.resolve();

async function getFiles(dir) {
    const dirents = await fs.promises.readdir(dir, {
        withFileTypes: true,
    });
    const files = await Promise.all(
        dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        })
    );
    return Array.prototype.concat(...files);
}

async function writeGeneratedFile() {
    const files = await getFiles("./cadence/");
    const checks = { mainnet: [], testnet: [] };
    for (let file of files) {
        const code = await fs.promises.readFile(file, "utf8");
        if (file.includes("mainnet")) {
            checks.mainnet.push({
                name: file.replace(/^.*[\\\/]/, "").split(".")[0],
                cadence: code,
            });
        } else if (file.includes("testnet")) {
            checks.testnet.push({
                name: file.replace(/^.*[\\\/]/, "").split(".")[0],
                cadence: code,
            });
        }
    }
    await fs.promises.writeFile(
        path.resolve(__dirname, `./src/generated/cadenceChecks.js`),
        `const CHECKS = ${JSON.stringify(checks)};\nexport default CHECKS;`
    );
}

writeGeneratedFile();
