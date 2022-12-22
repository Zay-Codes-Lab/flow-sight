const retrieveUserAddress = async () => {
  const accessToken = localStorage.getItem("flow.accessToken")
  const result = await fetch("https://flow-wallet.blocto.app/blocto/account/assets?", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "authorization": accessToken,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    "referrer": "https://flow-wallet.blocto.app/authz/2NIT6KlB-?l6n=https%3A%2F%2Fflovatar.com",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json())

  const asset = result.assets.find((asset) => { return asset.group === 'FLOW' })

  return asset.wallet_address
}

const createUI = () => {
  // look for buttons that have innerText of 'Approve'
  const approveButtons = document.getElementsByTagName("button")

  const footer = approveButtons[0].parentNode.parentNode

  // insert dom element under item
  const div = document.createElement("div");

  // create an image element pointing to the flow sight logo https://raw.githubusercontent.com/Zay-Codes-Lab/flow-sight/main/images/flow-sight.png
  const img = document.createElement("img");
  img.src = "https://raw.githubusercontent.com/Zay-Codes-Lab/flow-sight/main/images/flow-sight.png";
  // give the image style to be centered on the page and have a width of 100px
  img.style = "display: block; margin-left: auto; margin-right: auto; width: 50px;"
  div.appendChild(img);

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

  const diffContainer = document.createElement("div");
  diffContainer.id = "diffContainer"

  // within the diffContainer div, add some colored loading text
  const loadingText = document.createElement("p");
  loadingText.innerText = "Loading Preview..."
  loadingText.style = "color: black; text-align: center;"
  diffContainer.appendChild(loadingText);

  // ad diffContainer after the div
  div.appendChild(diffContainer);

  div.style = "background-color: #ddd; padding: 10px; margin: 5px; border-radius: 10px; max-width: 400px;"

  // place the div before the footer
  footer.parentNode.insertBefore(div, footer);
}

const updateUI = (diff, userAddress) => {
  let checks = {}
  for (const change of diff) {
    // group the change by their checkReadable field into checks
    if (checks[change.checkReadable] === undefined) {
      checks[change.checkReadable] = []
    }
    checks[change.checkReadable].push(change)
  } 

  // loop through checks object
  for (const check in checks) {
    // create a div that holds the check name and a list of changes
    const checkDiv = document.createElement("div");
    checkDiv.style = "background-color: #fff; padding: 12px; margin: 5px; border-radius: 10px;"
    const checkText = document.createElement("p");
    if (userAddress && check.indexOf(userAddress) !== -1) {
      checkText.innerText = check.replace(userAddress, `${userAddress} (your account)`)
    } else {
      checkText.innerText = check
    }

    let addOperations = 0
    let removeOperations = 0
    let changeOperations = 0
    for (const change of checks[check]) {
      if (change.operation === "A") {
        addOperations += 1
      } else if (change.operation === "R") {
        removeOperations += 1
      } else if (change.operation === "C") {
        changeOperations += 1
      }
    }

    // add a new line after checktext
    checkText.appendChild(document.createElement("br"));

    // under checkText, add a new line that lists the add in green, remove in red, and change in yellow operations
    const addCount = document.createElement("span");
    addCount.innerText = ` +${addOperations}`
    addCount.style = "color: green; font-weight: bold; text-align: center; padding: 2px;"
    checkText.appendChild(addCount);

    const removeCount = document.createElement("span");
    removeCount.innerText = ` -${removeOperations}`
    removeCount.style = "color: red; font-weight: bold; text-align: center; padding: 2px;"
    checkText.appendChild(removeCount);

    const changeCount = document.createElement("span");
    changeCount.innerText = ` ~${changeOperations}`
    changeCount.style = "color: orange; font-weight: bold; text-align: center; padding: 2px;"
    checkText.appendChild(changeCount);
    
    // create a new unordered list tag within checkText for each change
    const list = document.createElement("ul");


    const diffContainerOld = document.getElementById("diffContainer");
    diffContainerOld.innerHTML = ""
    
    // loop through each change in the check
    for (const change of checks[check]) {
      // create a new list item tag within list for each change
      const listItem = document.createElement("li");

      // add some space around each listItem
      listItem.style = "padding: 5px;"

      listItem.innerText = change.humanReadable
      list.appendChild(listItem);
    }

    // make the list hidden by default and expandable by clicking a `show more` text
    list.style = "list-style-type: none; padding: 0; margin: 0; display: none;"
    const showMore = document.createElement("span");
    showMore.innerText = "Show more"
    showMore.style = "color: #111; cursor: pointer; text-align: center; text-decoration: underline;"
    showMore.addEventListener("click", function() {
      if (list.style.display === "none") {
        list.style.display = "block";
        showMore.innerText = "Show less"
      } else {
        list.style.display = "none";
        showMore.innerText = "Show more"
      }
    })
    const breakElement = document.createElement("br");
    checkText.appendChild(breakElement);
    checkText.appendChild(showMore);

    checkText.appendChild(list);
    checkText.style = "font-weight: 400; text-align: center; max-width: 360px; overflow-wrap: break-word;"
    checkDiv.appendChild(checkText);

    const diffContainer = document.getElementById("diffContainer");

    diffContainer.appendChild(checkDiv);
  }
}

const run = async function (iteration) {
  const { flowSightFCL, flowSightTypes, flowSightDryRunTx } = window;
  flowSightFCL.config()
    .put("accessNode.api", "https://rest-mainnet.onflow.org")
    .put("flow.network", "mainnet")

  
  let el = window.document.getElementsByTagName("code")

  // re-run if iteration is less than 10
  if (iteration < 20 && el.length === 0) {
    setTimeout(async function() {
      run(iteration + 1)
    }, 200)
    return
  }

  // get the arguments and code from the first code block
  const allCode = el[0].innerText
  const args = allCode.split('\n')[0]

  // args looks like - Arguments: [1, test], make it so that it's just 1, test
  const stripped = args.replace('- Arguments: [', '').replace(']', '')
  const argsArray = stripped === '' ? [] : stripped.split(',').map((m) => { return m.trim() })

  // replace all code before a newline with empty string
  const code = allCode.replace(/.*\n/, '')

  // retrieve the account executing this tx.
  const userAddress = await retrieveUserAddress()

  // create the UI
  createUI()

  const dryRunArgs = await window.flowSightResolveArguments(argsArray, code)

  // dry run the tx
  dryRunResult = await flowSightDryRunTx(flowSightFCL, code, dryRunArgs, [userAddress], null)

  if (dryRunResult.error) {
    updateUI([{
      checkReadable: "This transaction will fail to run",
      humanReadable: `We ran into the following error when simulating your transaction:\n${dryRunResult.error}`,
      operation: 'e'
    }], null)
  } else if (dryRunResult.diff.length === 0) {
    updateUI([{
      checkReadable: "No changes to your account",
      humanReadable: "We did not find any changes that this transaction will result to in your account",
      operation: 'n'
    }], null)
  } else {
    updateUI(dryRunResult.diff, window.flowSightFCL.sansPrefix(userAddress))
  }
}

setTimeout(() => {
  run(0)
}, 0)
