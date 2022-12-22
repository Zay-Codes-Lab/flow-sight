const retrieveUserAddress = async () => {
  const accessTokenResult = await fetch("https://accounts.meetdapper.com/api/access-token", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => {
    return response.json()
  });

  const accessToken = accessTokenResult.accessToken

  const getAccountResponse = await fetch("https://graphql-api.meetdapper.com/graphql?GetAccount", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "authorization": accessToken,
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://accounts.meetdapper.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"operationName\":\"GetAccount\",\"variables\":{},\"query\":\"query GetAccount {\\n  getAccount {\\n    ...AccountBase\\n    lastPasswordReset\\n    identities {\\n      connection\\n      isSocial\\n      provider\\n      profileData {\\n        email\\n        emailVerified\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment AccountBase on Account {\\n  avatarID\\n  avatarURL\\n  nftAvatarID\\n  email\\n  emailVerified\\n  id\\n  username\\n  flowAccountID\\n  __typename\\n}\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => {
    return response.json()
  });

  return window.flowSightFCL.withPrefix(getAccountResponse.data.getAccount.flowAccountID)
}

const createUI = (diff) => {
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

      for (const change of diff) {
        // Add a bordered warning sign box within div that prints diff.checkReadable as a header, and diff.humanReadable as the body
        const warning = document.createElement("div");

        // create a backgroundcolor variable taht holds the hex code to a yellowish information color
        warning.style = "background-color: #fca503; padding: 5px; margin: 5px; border-radius: 10px;"
        const warningText = document.createElement("p");
        warningText.innerText = change.checkReadable + "\n" + change.humanReadable.replace(/Capability<&A\.\d+\.|Capability/g, "")
        warningText.style = "font-weight: 400; text-align: center; max-width: 360px; overflow-wrap: break-word;"
        warning.appendChild(warningText);
        div.appendChild(warning);
      }

      div.style = "background-color: #111; padding: 5px; margin: 5px; border-radius: 10px; max-width: 400px;"

      // place the div under the item
      item.parentNode.insertBefore(div, item.nextSibling);
      
      
    });
}

const run = async function () {
  const { flowSightFCL, flowSightTypes, flowSightDryRunTx } = window;
  flowSightFCL.config()
    .put("accessNode.api", "https://rest-mainnet.onflow.org")
    .put("flow.network", "mainnet")

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
      const userAddress = await retrieveUserAddress()
      const dryRunResult = await flowSightDryRunTx(flowSightFCL, sourceCode, [], [userAddress], null)

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
