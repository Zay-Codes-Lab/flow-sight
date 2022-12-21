const run = async function () {
  const { flowSightFCL, flowSightTypes, flowSightDryRunTx } = window;
  flowSightFCL.config()
    .put("accessNode.api", "https://rest-mainnet.onflow.org")
    .put("flow.network", "mainnet")
  const userData = JSON.parse(window.localStorage.getItem("ajs_user_traits"))
  const userAddress = userData["https://accounts.meetdapper.com/flow_account_id"]
  Array
    .from(window.document.getElementsByTagName("div"))
    .filter(function(item){
      return item.innerText === "See source code details"
    })
    .forEach(async function(item){
      // open up the source code pane
      item.click()

      // get the source code
      const codeBlocks = window.document.getElementsByClassName("prism-code")
      const sourceCode = codeBlocks[0].innerText
      const arguments = codeBlocks[1].innerText

      // dry run the tx
      // fcl, txCode, args, authorizers, providedChecks
      const dryRunResult = await flowSightDryRunTx(flowSightFCL, sourceCode, [], [userAddress], null)
      console.log(dryRunResult)

      Array
        .from(window.document.getElementsByTagName("button"))
        .filter(function(item){
          return item.innerText === "Close source code details"
        })
        .forEach(function(item){
          item.click()
        });
      
    });
}

setTimeout(() => {
  run()
}, 3000)