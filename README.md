# Flow Sight

![Logo](images/flow-sight.png)

Made by [Amit](https://github.com/aishairzay), [Bilal](https://github.com/bshahid331), and [Pratik](https://github.com/prpatel05)

## CLI

Flow Sight provides a command-line UX to simulate transactions, as well as displaying the current state of Flow Accounts based on the checks below.

### Dry Run Command

The `dry-run` command will simulate the provided Cadence Transaction.

```
Usage: flow-sight dry-run [options] <cadenceFile> <jsonArgs> <addresses...>

Dry run the provided transaction.

Arguments:
  cadenceFile               Cadence file to dry run
  jsonArgs                  JSON arguments for the transaction in FCL format
  addresses                 list of addresses to check

Options:
  -n, --network <network>   Flow network (default: "testnet")
  -c, --checks <checks...>  Checks to run, if none provided, all checks will be run
  -d, --diff-only           Only return the diff between the current state and the proposed state
  -h, --help                display help for command
```

#### Examples

```
yarn run flow-sight dry-run ./example/mainnet/init-ufc.cdc '[]' 0xf9f7a4ebaf29be6c -n mainnet
yarn run flow-sight dry-run ./example/mainnet/send-flow.cdc '[{"type": "UInt64", "value": 0.00000001}, {"type": "Address", "value": "0x54b9b6c046396b55"}]' 0xf9f7a4ebaf29be6c -n mainnet
yarn run flow-sight dry-run ./example/mainnet/move-topshot.cdc '[{"type": "Address", "value": "0x85712baf7934898c"}, {"type": "UInt64", "value": 7576979}]' 0xf9f7a4ebaf29be6c -n mainnet
```

### Current States Command

The `current-states` command will display the state of provided Flow Accounts based on our checks below.

```
Usage: flow-sight current-states [options] <addresses...>

Return the current state based on the available checks.

Arguments:
  addresses                 list of addresses to check

Options:
  -n, --network <network>   Flow network (default: "testnet")
  -c, --checks <checks...>  Checks to run, if none provided, all checks will be run
  -h, --help                display help for command
```

#### Examples

```
yarn run flow-sight current-states 0xf9f7a4ebaf29be6c -n mainnet
```

## Extension

The extension provided in this package lets you preview transactions from Blocto and Dapper wallet right away. Install the extension to get started in trying it out.

### How-to install

1. Go to the Chrome extensions page by entering `chrome://extensions` in the address bar and pressing Enter.
2. Enable Developer Mode by clicking the toggle switch in the top right corner of the page.
3. Click the `Load unpacked` button in the top left corner of the page.
4. In the file browser that appears, navigate to the `/extension` directory in your GitHub repository that contains the extension files.
5. Select the `/extension` directory and click the `Select` button.


## Checks

### Supported Checks

| Check                           | Mainnet | Testnet |
| ------------------------------- | ------- | ------- |
| Check FT Balances               | X       | X       |
| Check NFTs                      | X       | X       |
| Check Public Path Capabilities  | X       | X       |
| Check Private Path Capabilities | X       | X       |

### Onboarding new Checks

See example/checker.cdc for the template of your check.
