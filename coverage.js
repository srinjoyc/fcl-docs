import "./default-config"
import "./temp"
export {VERSION} from "./VERSION"
export {query} from "./exec/query"
export {serialize} from "./serialize" // TODO: what does this do?
export {transaction as tx} from "./transaction"
export {events} from "./events"

import {currentUser} from "./current-user"
export {currentUser} // done

export const authenticate = opts => currentUser().authenticate(opts) // done
export const unauthenticate = () => currentUser().unauthenticate() // done
export const reauthenticate = () => {  // done 
  currentUser().unauthenticate()
  return currentUser().authenticate()
}
export const signUp = opts => currentUser().authenticate() // done
export const logIn = opts => currentUser().authenticate() // done

export const authz = currentUser().authorization // done

import * as types from "@onflow/types"
export const t = types

export {config} from "@onflow/config" // done
export {send} from "@onflow/sdk" // done 
export {decode} from "@onflow/sdk" // done
export {account} from "@onflow/sdk" // done //  include in different section // exact same as getAccount?? => Let's just talk about builders (SHORT HAND FUNCTIONS)
export {latestBlock} from "@onflow/sdk"// done include in different section  // exact same as getLatestBlock?? =>  Let's just talk about builders (SHORT HAND FUNCTIONS)
export {isOk, isBad, why, pipe, build} from "@onflow/sdk" // what to document here? -> Should we cover build and pipe?
// isOk and isBad and why is going to be deprecated.
// build, pipe => Pipe takes an array and pushes through the whole array (given a ds and spits out a ds)
// build => Creates the data structure to begin with and push it through (skip the build on runtime)

// address utilities (display = withPrefix -> SHORTHAND)
export {withPrefix, sansPrefix, display} from "@onflow/util-address" // when to use what? with for display? Pass in  any format
export {template as cadence} from "@onflow/util-template" // deprecated // which one to use?? (probs this one)
export {template as cdc} from "@onflow/util-template" // deprecated // which one to use?? (shorthand)

// builders

// is there a way to split this up into logical groupings to make it easier to parse?

// template builders
export {transaction} from "@onflow/sdk" // done
export {script} from "@onflow/sdk" // done 
// REPLACE 'RETURNS' WITH 'RESPONSE' (for all decoding)
// explain the 'send' order 
// query builders
export {ping} from "@onflow/sdk" // TODO
export {atBlockHeight} from "@onflow/sdk" // done
export {atBlockId} from "@onflow/sdk"// done 
export {getAccount} from "@onflow/sdk" // done
export {getEvents} from "@onflow/sdk" // done - deprecated for getEventsAtBlockHeightRange
export {getEventsAtBlockHeightRange} from "@onflow/sdk" // done
export {getEventsAtBlockIds} from "@onflow/sdk" // done
export {getLatestBlock} from "@onflow/sdk" // done - deprecated for => getBlock()
export {getBlock} from "@onflow/sdk" // done
export {getBlockHeader} from "@onflow/sdk" // done
export {getBlockById} from "@onflow/sdk"  // deprecated for getBlock() + atBlockId()
export {getBlockByHeight} from "@onflow/sdk" // deprecated use getBlock() + atBlockHeight()
export {getCollection} from "@onflow/sdk" // TODO: NEED HELP HERE - if you need to get info before it has been processed as a block
export {getTransactionStatus} from "@onflow/sdk" // done 
export {getTransaction} from "@onflow/sdk" // done

// utility builders
export {authorizations, authorization} from "@onflow/sdk" // todo
export {args, arg} from "@onflow/sdk" // done
export {proposer} from "@onflow/sdk" // todo
export {payer} from "@onflow/sdk" // todo
export {limit} from "@onflow/sdk" // todo
export {ref} from "@onflow/sdk" // todo
export {params, param} from "@onflow/sdk" // todo
export {validator} from "@onflow/sdk" // todo
export {invariant} from "@onflow/sdk" // todo
// TODO: Custom authorization functions

// Interaction Types => Transaction or Script