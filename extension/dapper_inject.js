
const createUI = () => {
  Array
    .from(window.document.getElementsByTagName("div"))
    .filter(function(item){
      return item.innerText === "See source code details"
    })
    .forEach(async function(item){
      // insert dom element under item
      const div = document.createElement("div");

      // create a text element that's centered within div and says "Flow Sight" in bold
      const text = document.createElement("p");
      text.innerText = "Flow Sight\n";
      text.style = "font-weight: bold; text-align: center;"
      div.appendChild(text);
      
      // Add another text element that's centered within div and says "The following changes will occur when you confirm this action"
      const text2 = document.createElement("span");
      text2.innerText = "Preview the changes to your account\nMade by Amit, Bilal, and Pratik";
      text2.style = "font-weight: 400; text-align: center;"
      text.appendChild(text2);

      div.style = "background-color: #1f1f1f; padding: 5px; margin: 5px; border-radius: 10px;"

      // place the div under the item
      item.parentNode.insertBefore(div, item.nextSibling);
      
    });
}

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

        createUI(dryRunResult.diff)
    });
}

setTimeout(() => {
  run()
}, 3000)
