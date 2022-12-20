// this is the code which will be injected into a given page...

(async function () {
  console.log('i got fcl', window.flowSightFCL)
  console.log('i got t', window.flowSightTypes)
  console.log('dryrun', flowSightDryRunTx)
})();