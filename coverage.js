import "./default-config"
import "./temp"
export {VERSION} from "./VERSION"
export {query} from "./exec/query"
export {serialize} from "./serialize"
export {transaction as tx} from "./transaction"
export {events} from "./events"

import {currentUser} from "./current-user"
export {currentUser}

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

export {config} from "@onflow/config" // where to find more docs on this?
export {send} from "@onflow/sdk" // done 
export {decode} from "@onflow/sdk" // done
export {account} from "@onflow/sdk" // exact same as getAccount?? => Let's just talk about builders (SHORT HAND FUNCTIONS)
export {latestBlock} from "@onflow/sdk"  // exact same as getLatestBlock?? =>  Let's just talk about builders (SHORT HAND FUNCTIONS)
export {isOk, isBad, why, pipe, build} from "@onflow/sdk" // what to document here? -> Should we cover build and pipe?
// isOk and isBad is going to be deprecated.
// build, pipe => Pipe takes an array and pushes through the whole array (given a ds and spits out a ds)
// build => Creates the data structure to begin with and push it through (skip the build on runtime)

// address utilities (display = withPrefix -> SHORTHAND)
export {withPrefix, sansPrefix, display} from "@onflow/util-address" // when to use what? with for display? Pass in  any format
export {template as cadence} from "@onflow/util-template" // which one to use?? (probs this one)
export {template as cdc} from "@onflow/util-template" // which one to use?? (shorthand)

// builders

// is there a way to split this up into logical groupings to make it easier to parse?

// template builders
export {transaction} from "@onflow/sdk"
export {script} from "@onflow/sdk"

// query builders
export {ping} from "@onflow/sdk"
export {atBlockHeight} from "@onflow/sdk"
export {atBlockId} from "@onflow/sdk"
export {getAccount} from "@onflow/sdk" // done -> confirm this over 'account' above
export {getEvents} from "@onflow/sdk" // not used on kitty-items or flow port
export {getEventsAtBlockHeightRange} from "@onflow/sdk" // need help getting a sample function
export {getEventsAtBlockIds} from "@onflow/sdk" // not used
export {getLatestBlock} from "@onflow/sdk" // deprecated for => getBlock()
export {getBlock} from "@onflow/sdk" // requires two builders to get block at a particular height
export {getBlockHeader} from "@onflow/sdk"
export {getBlockById} from "@onflow/sdk"  // deprecated
export {getBlockByHeight} from "@onflow/sdk" // deprecated
export {getCollection} from "@onflow/sdk"
export {getTransactionStatus} from "@onflow/sdk"
export {getTransaction} from "@onflow/sdk"
// utility builders
export {authorizations, authorization} from "@onflow/sdk"
export {args, arg} from "@onflow/sdk"
export {proposer} from "@onflow/sdk"
export {payer} from "@onflow/sdk"
export {limit} from "@onflow/sdk" // how to determine limit
export {ref} from "@onflow/sdk" // what is this used for?
export {params, param} from "@onflow/sdk"
export {validator} from "@onflow/sdk" // what is this used for?
export {invariant} from "@onflow/sdk" // what is this used for?


// Interaction Types => Transaction or Script