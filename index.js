import { getChecks } from './src/ChecksFactory.js'
import AccountStateScaffold from './src/AccountStateScaffold.js'
import t from '@onflow/types'

/*
    Please excuse the comments and lengthy code, this was
    written using copilot and I have not yet cleaned it up.
*/
function convertTxToScript(txCode, authorizers) {
    // replace the transaction code with the script code
    let scriptCode = txCode.replace('transaction', 'pub fun main').trim()

    // after pub fun main and before the brace, add a `: Int` to the scriptCode, but keep what was in the args of the transaction
    scriptCode = scriptCode.replace(/pub fun main\((.*?)\)\s*{/, 'pub fun main($1): AnyStruct {')    

    // remove any post statement code
    scriptCode = scriptCode.replace(/post\s*{(.*?)}/, '')

    // find the index of the first open curly brace
    const firstOpenCurlyBraceIndex = scriptCode.indexOf('{')

    // find the index of the prepare statement
    const prepareIndex = scriptCode.indexOf('prepare')

    // store all lines between firstopencurlybraceindex and prepareindex
    const lines = scriptCode.substring(firstOpenCurlyBraceIndex + 1, prepareIndex)

    // split the lines by new line
    const linesArray = lines.split('\n')

    // remove the empty lines
    const linesArrayWithoutEmptyLines = linesArray.filter(line => line.trim() !== '')

    // loop through the linesArrayWithoutEmptyLines
    for (let i = 0; i < linesArrayWithoutEmptyLines.length; i++) {
        // get the current line
        const line = linesArrayWithoutEmptyLines[i]

        // find the index of the first colon
        const firstSemicolonIndex = line.indexOf(':')

        // store the line without the semicolon
        const lineWithoutSemicolon = line.substring(0, firstSemicolonIndex)

        // store the line without the semicolon and the let
        const lineWithoutSemicolonAndLet = lineWithoutSemicolon.replace('let', '').replace('var', '').replace(' ', '').trim()

        // search throughout scriptCode for the lineWithoutSemicolonAndLet and replace with line
        scriptCode = scriptCode.replace(`self.${lineWithoutSemicolonAndLet}`, line)

        // search throughout the rest of scriptCode for the lineWithoutSemicolonAndLet and replace with lineWithoutSemicolonAndLet
        scriptCode = scriptCode.replace(`self.${lineWithoutSemicolonAndLet}`, lineWithoutSemicolonAndLet)

        // remove line from scriptCode
        scriptCode = scriptCode.replace(line, '')
    }

    // parse all arguments of the prepare statement into an array of strings using regex
    const prepareArgs = scriptCode.match(/prepare\((.*?)\)\s*{/)[1].split(',')

    // create an empty string to store the authAccounts
    let authAccounts = ''

    // loop through prepareArgs
    for (let i = 0; i < prepareArgs.length; i++) {
        // get the current prepareArg
        const prepareArg = prepareArgs[i]

        // extract the string before the colon
        const prepareArgWithoutColon = prepareArg.substring(0, prepareArg.indexOf(':')).trim()

        // add to the authAccounts string the prepareArgsWithoutColon as a new line in the string
        authAccounts += `let ${prepareArgWithoutColon} = getAuthAccount(${authorizers[i]})\n`
    }

    // place the authAccounts string directly after the pub fun main line while keeping the pub fun main line as is
    scriptCode = scriptCode.replace(/pub fun main(.*){/, `pub fun main$1{\n\t${authAccounts}`)

    // remove the transaction code for prepare statement including all arguments to prepare with a regex statement
    scriptCode = scriptCode.replace(/prepare\((.*?)\)\s*{/, '')

    // find where the execute statement is
    const executeIndex = scriptCode.indexOf('execute')

    // if the execute statement was found
    if (executeIndex !== -1) {
        // remove the closing curly brace closest before to the executeIndex with a regex statement
        scriptCode = scriptCode.replace(/}\s*execute\s*{/, '')

        // remove the 2nd to last closing brace from scriptCode using a regex
        scriptCode = scriptCode.replace(/}\s*}/, '}').trim()
    }

    // before the last curly brace, add `return 1` to the scriptCode
    scriptCode = scriptCode.replace(/}\s*$/, '\n\tlet flowSightResult: {String: AnyStruct} = {}\n\t/*INSERT_CODE_HERE*/\n\treturn flowSightResult\n}')

    // remove any consecutive blank lines froms scriptCode
    for ( let i = 0; i < 2; i++ ) {
        scriptCode = scriptCode.replace(/\n\n/g, '\n')
    }

    return scriptCode
}

async function dryRunTx(fcl, txCode, args, authorizers) {
    const checks = getChecks()
    console.log(checks);

    /* format of state =
        {
            "0x01": {
                "ftBalancesCheck": {
                    "FreeformData": "From the snippet script"
                }
            },
            ...
        }
    */

    const oldState = {}

    // loop through all authorizers
    for (let i = 0; i < authorizers.length; i++) {
        oldState[authorizers[i]] = {}
        // loop through checks
        const keys = Object.keys(checks)
        for (let j = 0; j < keys.length; j++) {
            const key = keys[j]
            const check = checks[key].check
            const imports = checks[key].imports

            const accountStateScaffold = AccountStateScaffold

            // modify the accountStateScaffold to include the check at the /*INSERT_CODE_HERE*/ line
            let curScript = accountStateScaffold.replace('/*INSERT_CODE_HERE*/', check)
            curScript = curScript.replace('/*INSERT_IMPORTS_HERE*/', imports)
            // execute curScript with fcl and store the result
            const result = await fcl
                .send([
                    fcl.script(curScript),
                    fcl.args([
                        fcl.arg(authorizers[i], t.Address)
                    ]),
                    fcl.limit(1000),
                ])
                .then(fcl.decode)
            
            oldState[authorizers[i]][key] = result
        }
    }

    console.log('old state is', oldState)

    // run convertTxToScript and get the updated script code
    const scriptCode = convertTxToScript(txCode, authorizers)

    //const newState = 

    // compare oldState and newState


    // print scriptCode
    //console.log(scriptCode)

    // run scriptCode and store the result
    /*const result = await fcl
        .send([
            fcl.script(scriptCode),
            fcl.args(args),
            fcl.limit(1000),
        ])
        .then(fcl.decode)
        */

}

export {
    dryRunTx
}