
export default `

pub fun main(addr: Address): AnyStruct {
  let acct = getAuthAccount(addr)
  let flowSightResult: {String: AnyStruct} = {}

  /*INSERT_CODE_HERE*/

  return flowSightResult
}

`