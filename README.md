# Flow Client Library (FCL) API Reference

**Version**: 0.73.0

**Last Updated**: June 25, 2021

**Github**: https://github.com/onflow/flow-js-sdk/

# Configuration

FCL has a mechanism that lets you configure various aspects of FCL. When you move from one instance of the Flow Blockchain to another (Local Emulator to Testnet to Mainnet) the only thing you should need to change for your FCL implementation is your configuration.

---

## Setting Configuration Values

Values only need to be set once. We recomend doing this once and as early in the life cycle as possible.
To set a configuation value, the `put` method on the `config` instance needs to be called, the `put` method returns the `config` instance so they can be chained.

```javascript
import * as fcl from "@onflow/fcl";

fcl
  .config() // returns the config instance
  .put("foo", "bar") // configures "foo" to be "bar"
  .put("baz", "buz"); // configures "baz" to be "buz"
```

## Getting Configuration Values

The `config` instance has an asynchronous `get` method. You can also pass it a fallback value incase the configuration state does not include what you are wanting.

```javascript
import * as fcl from "@onflow/fcl";

fcl.config().put("foo", "bar").put("woot", 5).put("rawr", 7);

const FALLBACK = 1;

async function addStuff() {
  var woot = await fcl.config().get("woot", FALLBACK); // will be 5 -- set in the config before
  var rawr = await fcl.config().get("rawr", FALLBACK); // will be 7 -- set in the config before
  var hmmm = await fcl.config().get("hmmm", FALLBACK); // will be 1 -- uses fallback because this isnt in the config

  return woot + rawr + hmmm;
}

addStuff().then((d) => console.log(d)); // 13 (5 + 7 + 1)
```

## Common Configuration Keys

| Name                        | Example                                              | Description                                                                                               |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `accessNode.api` (required) | `https://access-testnet.onflow.org`                  | API URL for the Flow Blockchain Access Node you want to be communicating with. See list here.             |
| `env`                       | `testnet`                                            | Used in conjunction with stored interactions. Possible values: `local`, `canarynet`, `testnet`, `mainnet` |
| `discovery.wallet`          | `https://fcl-discovery.onflow.org/testnet/authn`     | Points FCL at the Wallet or Wallet Discovery mechanism.                                                   |
| `app.detail.title`          | `Cryptokitties`                                      | Your applications title, can be requested by wallets and other services.                                  |
| `app.detail.icon`           | `https://fcl-discovery.onflow.org/images/blocto.png` | Url for your applications icon, can be requested by wallets and other services.                           |
| `challenge.handshake`       | DEPRECATED                                           | Use `discovery.wallet` instead.                                                                           |

## Address replacement in scripts and transactions

Configuration keys that start with `0x` will be replaced in FCL scripts and transactions, this allows you to write your script or transaction Cadence code once and not have to change it when you point your application at a difference instance of the Flow Blockchain.

```javascript
import * as fcl from "@onflow/fcl";

fcl.config().put("0xFungibleToken", "0xf233dcee88fe0abe");

async function myScript() {
  return fcl
    .send([
      fcl.script`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      pub fun main() { /* Rest of the script goes here */ }
    `,
    ])
    .then(fcl.decode);
}

async function myTransaction() {
  return fcl
    .send([
      fcl.transaction`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      transaction { /* Rest of the transaction goes here */ }
    `,
    ])
    .then(fcl.decode);
}
```

## Example

```javascript
import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("env", "testnet")
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://i.imgur.com/r23Zhvu.png")
  .put("0xFlowToken", "0x7e60df042a9c0868");
```

> :tomato: left out openID scopes

---

# Wallet Interactions

These methods allows dapps to interact with wallet services in order to authenticate the user and authorize transactions on their behalf.

## Methods

---

## `fcl.authenticate()`

> :warning: **This method can only be used client side.**

Used to authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `discovery.wallet` endpoint which lets the user select a supported custodial wallet ([see supported wallets](#Wallets)). :tomato: Fix link

### Note

:warning: `discovery.wallet` value **must** be set in the configuration before calling this method. See [FCL Configuration](#Configuration).

:loudspeaker: The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
fcl
  .config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
// anywhere on the page
fcl.authenticate();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.unauthenticate()`

> :warning: **This method can only be used client side.**

Logs out the current user.

### Note

:warning: The current user must be authenticated first.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
fcl.config().put("accessNode.api", "https://access-testnet.onflow.org");
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.unauthenticate();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.reauthenticate()`

> :warning: **This method can only be used client side.**

A **convenience method** that calls `fcl.unauthenticate()` and then `fcl.authenticate()` for the current user.

### Note

:warning: The current user must be authenticated first.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.reauthenticate();
// logs out user and opens up login/sign-up flow
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.signUp()`

> :warning: **This method can only be used client side.**

A **convenience method** that calls [`fcl.authenticate()`](<##`fcl.authenticate()`>)

### Note

:warning: The current user must be authenticated first.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// equivalent to fcl.authenticate()
fcl.signUp();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.login()`

> :warning: **This method can only be used client side.**

A **convenience method** that calls [`fcl.authenticate()`](<##`fcl.authenticate()`>).

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// equivalent to fcl.authenticate()
fcl.login();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.authz`

A **convenience method** that produces the needed authorization details for the current user to submit transactions to Flow.

### Returns

| Type                                           | Description                                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [AuthorizationObject](##`AuthorizationObject`) | An object containing the necessary details from the current user to authorize a transaction in any role. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// anywhere on the page
console.log(fcl.authz);
// prints {addr, signingFunction, keyId, sequenceNum} from the current user.

const response = fcl.send([
  fcl.transaction(CODE),
  fcl.args([
    fcl.arg(Number(itemID), t.UInt64),
    fcl.arg(String(price), t.UFix64),
  ]),
  fcl.proposer(fcl.authz), // use as a alias when authorizing transactions for the current user
  fcl.payer(fcl.authz),
  fcl.authorizations([fcl.authz]),
  fcl.limit(1000),
]);
```

### Examples

- [Authorize a transaction](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

# Current User

Holds the [current user](##`CurrentUserObject`) if set and offers a set of functions to manage the authentication and authorization of the user.

## Methods

---

## `fcl.currentUser().subscribe(callback)`

A method to use with your state management tool of choice to set and unset the current user based on the authentication functions.

> :warning: **This method can only be used client side.**

### Arguments

| Name       | Type     | Description                                                                                                                               |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `callback` | function | The callback will be called with the [current user](##`CurrentUserObject`) as the first argument when the current user is set or removed. |

### Usage

```javascript
import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export function AuthCluster() {
  const [user, setUser] = useState({ loggedIn: null });
  useEffect(() => fcl.currentUser().subscribe(setUser), []); // sets the callback for FCL to use

  if (user.loggedIn) {
    return (
      <div>
        <span>{user?.addr ?? "No Address"}</span>
        <button onClick={fcl.unauthenticate}>Log Out</button> {/* once logged out in setUser(user) will be called */}
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>{" "}
        {/* once logged in setUser(user) will be called */}
        <button onClick={fcl.signUp}>Sign Up</button> {/* once signed up, setUser(user) will be called */}
      </div>
    );
  }
}
```

### Examples

- [Auth Cluster in React](https://docs.onflow.org/flow-js-sdk/flow-app-quickstart/#authentication)

---

## `fcl.currentUser().snapshot()`

:tomato: TODO

---

## `fcl.currentUser().signUserMessage(msg, opts)`

:tomato: TODO

---

## `fcl.currentUser().authenticate()`

Equivalent to `fcl.authenticate()` (recommended).

---

## `fcl.currentUser().unauthenticate()`

Equivalent to `fcl.unauthenticate()` (recommended).

---

## `fcl.currentUser().authorization()`

Equivalent to `fcl.authz` (recommended).

---

# On-chain Interactions

> :loudspeaker: **These methods can be used both on the client and server.**

These methods allows dapps to interact directly with the Flow blockchain via a set of functions that currently use the [Access Node API](https://docs.onflow.org/access-api/) along with utilities to make it easier to send and decode responses. This set of functionality is similar to what is offered in other [SDKs](https://docs.onflow.org/sdks/) but allows for greater composability and customizability.

**In general, all interactions need to be built and sent to the chain via `fcl.send()` and then decoded via `fcl.decode()`.**

## Methods

---

## `fcl.send([...builders])`

Sends arbitrary scripts, transactions, and requests to the blockchain.

It consumes an array of [builders](https://google.ca) that are to be resolved and sent. The builders required to be included in the array depend on the [interaction](##`Interactions`) that is being built.

### Note

:warning: Must be used in conjuction with [`fcl.decode(response)`](<##`fcl.decode(response)`>) to get back correct keys and all values in JSON.

### Arguments

| Name       | Type                                | Description            |
| ---------- | ----------------------------------- | ---------------------- |
| `builders` | Array: [[...builders]](#`Builders`) | See builder functions. |

### Returns

| Type                                 | Description                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ResponseObject](##`ResponseObject`) | An object containing the data returned from the chain. Should always be decoded with `fcl.decode()` to get back appropriate JSON keys and values. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// a script only needs to resolve the arguments to the script
const response = await fcl.send([fcl.script`${script}`, fcl.args(args)]);
// note: response values are encoded, call await fcl.decode(response) to get JSON

// a transaction requires multiple 'builders' that need to be resolved prior to being sent to the chain - such as setting the authorizations.
const response = await fcl.send([
  fcl.transaction`
    ${transaction}
    `,
  fcl.args(args),
  fcl.proposer(proposer),
  fcl.authorizations(authorizations),
  fcl.payer(payer),
  fcl.limit(9999),
]);
// note: response is encoded, call await fcl.decode(response) to get JSON
```

### Examples

- [Getting a user account](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Getting the latest block](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Sending a transaction](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.decode(response)`

Decodes the response from `fcl.send()` into the appropriate JSON representation of all relevant keys and values.

### Note

:loudspeaker: To decode custom structs and define your own custom decoding, see [`tutorial`](#TODO).

### Arguments

| Name       | Type                                 | Description                                            |
| ---------- | ------------------------------------ | ------------------------------------------------------ |
| `response` | [ResponseObject](##`ResponseObject`) | Should be the response returned from `fcl.send([...])` |

### Returns

| Type | Description                                                                                                                                                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| any  | A JSON representation of the raw string response depending on the cadence code executed.<br> The return value can be a single value and type or an object with multiple types. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

// simple script to add 2 numbers
const response = await fcl.send([
  fcl.script`
        pub fun main(int1: Int, int2: Int): Int {
            return int1 + int2
        }
    `,
  fcl.args([fcl.arg(1, types.Int), fcl.arg(2, types.Int)]),
]);

const decoded = await fcl.decode(response);

assert(3 === decoded);
assert(typeof decoded === "number");
```

### Examples

- [Getting a user account](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Getting the latest block](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Sending a transaction](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

# Builders

These methods fill out various portions of a transaction or script template in order to
build, resolve, and send it to the blockchain. A valid populated template is referred to as an [Interaction](##`Interaction`).

:warning: **These methods must be used with `fcl.send([...builders])`**

## Query Builders

## `fcl.getAccount(address)`

A builder function that returns the interaction to get an account by address.

### Arguments

| Name      | Type                   | Description                                                                        |
| --------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `address` | [Address](##`Address`) | Address of the user account with or without a prefix (both formats are supported). |

### Returns

| Type                           | Description                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| [Interaction](##`Interaction`) | An interaction that contains the code and values needed to get an account. |

### Returns after decoding

| Type                         | Description                              |
| ---------------------------- | ---------------------------------------- |
| [AccountObject](##`Account`) | A JSON representation of a user account. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// somewhere in an async function
// fcl.account is the same as this function
const getAccount = async (address) => {
  const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
  return account;
};
```

---

## `fcl.getBlock(isSealed)`

A builder function that returns the interaction to get the latest block.
:loudspeaker: Use with `fcl.atBlockId()` and `fcl.atBlockHeight()` when building the interaction to get information for older blocks.

### Arguments

| Name       | Type    | Default | Description                                                                       |
| ---------- | ------- | ------- | --------------------------------------------------------------------------------- |
| `isSealed` | boolean | false   | If the latest block should be sealed or not. See [block states](##`Interaction`). |

### Returns after decoding

| Type                           | Description                                           |
| ------------------------------ | ----------------------------------------------------- |
| [BlockObject](##`BlockObject`) | The latest block if not used with any other builders. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const latestSealedBlock = await fcl
  .send([
    fcl.getBlock(true), // isSealed = true
  ])
  .then(fcl.decode);
```

---

## `fcl.getBlockHeader()`

A builder function that returns the interaction to get a block header.
:loudspeaker: Use with `fcl.atBlockId()` and `fcl.atBlockHeight()` when building the interaction to get information for older blocks.

### Returns after decoding

| Type                                       | Description                                                  |
| ------------------------------------------ | ------------------------------------------------------------ |
| [BlockHeaderObject](##`BlockHeaderObject`) | The latest block header if not used with any other builders. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const latestBlockHeader = await fcl
  .send([fcl.getBlockHeader()])
  .then(fcl.decode);
```

---

## `fcl.getLatestBlock(isSealed)` - Deprecated

Use [`fcl.getBlock`](##`fcl.getBlock`).

---

## `fcl.getEvents(eventName,fromBlock,toBlock)` - Deprecated

Use [`fcl.getEventsAtBlockHeightRange`](##`fcl.getEventsAtBlockHeightRange`).

---

## `fcl.getEventsAtBlockHeightRange(eventName,fromBlockHeight,toBlockHeight)`

A builder function that returns all instances of a particular event (by name) within a height range.
:warning: The block range provided must be from the current spork. All events emitted during past sporks is current unavailable.
:warning: The block range provided must be 250 blocks or lower per request.

### Arguments

| Name              | Type                       | Description                                                      |
| ----------------- | -------------------------- | ---------------------------------------------------------------- |
| `eventName`       | [EventName](##`EventName`) | The name of the event.                                           |
| `fromBlockHeight` | number                     | The height of the block to start looking for events (inclusive). |
| `toBlockHeight`   | number                     | The height of the block to stop looking for events (inclusive).  |


### Returns after decoding

| Type                             | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| [[EventObject]](##`EventObject`) | An array of events that matched the eventName. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const events = await fcl
  .send([
    fcl.getEventsAtBlockHeightRange(
      "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
      35580624,
      35580624
    ),
  ])
  .then(fcl.decode);
```

---

## `fcl.getEventsAtBlockIds(eventName,[...blockIds])`

A builder function that returns all instances of a particular event (by name) within a set of blocks specified by block ids.

:warning: The block range provided must be from the current spork. All events emitted during past sporks is current unavailable.

### Arguments

| Name        | Type                       | Description                               |
| ----------- | -------------------------- | ----------------------------------------- |
| `eventName` | [EventName](##`EventName`) | The name of the event.                    |
| `blockIds`  | number                     | The ids of the blocks to scan for events. |

### Returns after decoding

| Type                             | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| [[EventObject]](##`EventObject`) | An array of events that matched the eventName. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const events = await fcl
  .send([
    fcl.getEventsAtBlockIds(
      "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
      [
        "c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7",
        "5dbaa85922eb194a3dc463c946cc01c866f2ff2b88f3e59e21c0d8d00113273f",
      ]
    ),
  ])
  .then(fcl.decode);
```

---

## Utility Builders

## `fcl.arg(value, type)`

A utility builder to be used with `fcl.args[...]` to create FCL supported arguments for interactions.

### Arguments

| Name    | Type                | Description                                               |
| ------- | ------------------- | --------------------------------------------------------- |
| `value` | any                 | Any value that you are looking to pass to other builders. |
| `type`  | [FType](##`FTypes`) | A type supported by Flow.                                 |

### Returns

| Type                                 | Description                         |
| ------------------------------------ | ----------------------------------- |
| [ArgumentObject](##`ArgumentObject`) | Holds the value and type passed in. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl
  .send([
    fcl.script`
      pub fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    fcl.args([
      fcl.arg(5, t.Int), // a
      fcl.arg(4, t.Int), // b
    ]),
  ])
  .then(fcl.decode);
```

---

## `fcl.args([...args])`

A utility builder to be used with other builders to pass in arguments with a value and supported type.

### Arguments

| Name   | Type                                     | Description                                                           |
| ------ | ---------------------------------------- | --------------------------------------------------------------------- |
| `args` | [[Argument Objects]](##`ArgumentObject`) | An array of arguments that you are looking to pass to other builders. |

### Returns

| Type                                   | Description                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](##`Interaction`) | An interaction that contains the arguments and types passed in. This alone is a partial and incomplete interaction. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl
  .send([
    fcl.script`
      pub fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    fcl.args([
      fcl.arg(5, t.Int), // a
      fcl.arg(4, t.Int), // b
    ]),
  ])
  .then(fcl.decode);
```

---

## Template Builders

## `fcl.script(CODE)`

A template builder to use a Cadence script for an interaction.
:loudspeaker: Use with `fcl.args[...]` to pass in arguments dynamically.

### Arguments

| Name   | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| `CODE` | string | Should be valid Cadence script. |

### Returns

| Type                           | Description                                   |
| ------------------------------ | --------------------------------------------- |
| [Interaction](##`Interaction`) | An interaction containing the code passed in. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const code = `
  pub fun main(): Int {
    return 5 + 4
  }
`;
const answer = await fcl.send([fcl.script(code)]).then(fcl.decode);
console.log(answer); // 9
```

---

## `fcl.transaction(CODE)`

A template builder to use a Cadence transaction for an interaction.
:warning: Must be used with `fcl.payer`, `fcl.proposer`, `fcl.authorizations` to produce a valid interaction before sending to the chain.
:loudspeaker: Use with `fcl.args[...]` to pass in arguments dynamically.

### Arguments

| Name   | Type   | Description                            |
| ------ | ------ | -------------------------------------- |
| `CODE` | string | Should be valid a Cadence transaction. |

### Returns

| Type                           | Description                                   |
| ------------------------------ | --------------------------------------------- |
| [Partial Interaction](##`Interaction`) | An partial interaction containing the code passed in. Further builders are required to complete the interaction. See description. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const code = `
  pub fun main(): Int {
    return 5 + 4
  }
`;
const answer = await fcl.send([fcl.script(code)]).then(fcl.decode);
console.log(answer); // 9
```

---

# Types

## `Builders`

Builders are modular functions that can be coupled together with `fcl.send([...builders])` to create an [Interaction](##`Interactions`). The builders needed to create an interaction depend on the script or transaction that is being sent.

## `Interactions`

An interaction is a a template containing a valid string of Cadence code that either a script or a transaction. Please read the guide on [FCL Interactions](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js).

## `AuthorizationObject`

This type conforms to the interface required for FCL to authorize transaction on behalf o the current user.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `addr` | [Address](##`Address`) | The address of the authorizer |
| `signingFunction` | function | A function that allows FCL to sign using the authorization details and produce a valid signature. |
| `keyId` | number | The index of the key to use during authorization. (Multiple keys on an account is possible). |
| `sequenceNum` | number | A number that is incremented per transaction using they keyId. |

## `AccountObject`

The JSON representation of an account on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `address` | [Address](##`Address`) | The address of the account |
| `balance` | number | The FLOW balance of the account in 10\*6. |
| `code` | [Code](##`Code`) | ???? |
| `contracts` | Object: [Contract](##`contract`) | An object with keys as the contract name deployed and the value as the the cadence string. |
| `keys` | [[KeyObject]](##`Key`) | Any contracts deployed to this account. |

## `Address`

| Value Type        | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A valid Flow address should be 16 characters in length. <br>A `0x` prefix is optional during inputs. <br>eg. `f8d6e0586b0a20c1` |

## `ArgumentObject`

An argument object created by `fcl.arg(value,type)`
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `value` | any | Any value to be used as an argument to a builder. |
| `xform` | [FType](##`FType`) | Any of the supported types on Flow. |

## `EventName`

| Value Type        | Description                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A event name in Flow must follow the format `A.{AccountAddress}.{ContractName}.{EventName}` <br>eg. `A.ba1132bc08f82fe2.Debug.Log` |

## `Contract`

| Value Type        | Description                                          |
| ----------------- | ---------------------------------------------------- |
| string(formatted) | A formatted string that is a valid cadence contract. |

## `KeyObject`

This is the JSON representation of a key on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `index` | number | The address of the account |
| `publicKey` | string | The FLOW balance of the account in 10\*6. |
| `signAlgo` | number | An index referring to one of `ECDSA_P256` or `ECDSA_secp256k1` |
| `hashAlgo` | number | An index referring to one of `SHA2_256` or `SHA3_256` |
| `weight` | number | A number between 1 and 1000 indicating the relative weight to other keys on the account. |
| `sequenceNumber` | number | This number is incremented for every transaction signed using this key. |
| `revoked` | boolean | If this key has been disabled for use. |

## `BlockObject`

The JSON representation of a key on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `id` | string | The id of the block. |
| `parentId` | string | The id of the parent block. |
| `height` | number | The height of the block. |
| `timestamp` | object | Contains time related fields. |
| `collectionGuarantees` | [] | :tomato: TODO |
| `blockSeals` | [[SealedBlockObject]](##`SealedBlockObject`) | The details of which nodes executed and sealed the blocks. |
| `signatures` | Uint8Array([numbers]) | All signatures. |

## `BlockHeaderObject`

The subset of the [BlockObject](##`BlockObject`) containing only the header values of a block.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `id` | string | The id of the block. |
| `parentId` | string | The id of the parent block. |
| `height` | number | The height of the block. |
| `timestamp` | object | Contains time related fields. |

## `ResponseObject`

The format of all responses in FCL returned from `fcl.send(...)`
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `tag` | string | :tomato: TODO |
| `transaction` | [Transaction](##`Transaction`) | :tomato: TODO |
| `transactionStatus` | [TransactionStatus](##`TransactionStatus`) | :tomato: TODO |
| `transactionId` | [TransactionId](##`TransactionId`) | :tomato: TODO |
| `encodedData` | object | :tomato: TODO |
| `events` | object | :tomato: TODO |
| `account` | object | :tomato: TODO |
| `block` | object | :tomato: TODO |
| `blockHeader` | object | :tomato: TODO |
| `latestBlock` | object | :tomato: TODO |
| `collection` | object | :tomato: TODO |

## `FType`

FCL arguments must specify one of the following support types for each value passed in.
| Type |
| ---- |
| `UInt` |
| `UInt8` |
| `UInt16` |
| `UInt32` |
| `UInt64` |
:tomato: TODO add more
