# Flow Client Library (FCL) API Reference

**Version**: 0.70.0

**Last Updated**: June 10th, 2021

**Github**: https://github.com/onflow/flow-js-sdk/

# Wallet Interactions

These methods allows dapps to interact with wallet services in order to authenticate the user and authorize transactions on their behalf.

> :warning: **These methods can only be used client side.**

## Methods

---

## `fcl.authenticate()`

Used to authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `challenge.handshake` endpoint or default to the `discovery.wallet` endpoint which lets the user select a supported custodial wallet ([see supported wallets](#Wallets)).

### Note

:warning: Either `challenge.handshake` or `discovery.wallet` values **must** be set in the configuration before calling this method. See [FCL Configuration](#Methods).

:loudspeaker: Should only be used if using a different set of authentication options are needed rather than the default. Use the aliases [`fcl.login()`](<##`fcl.login()`>) or [`fcl.signup()`](<##`fcl.signUp()`>) instead.

:loudspeaker: The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// anywhere on the page
fcl.authenticate();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.unauthenticate()`

Logs out the current user.

### Note

:warning: The current user must be authenticated first.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.unauthenticate();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.reauthenticate()`

A convenience method that calls `fcl.unauthenticate()` and then `fcl.authenticate()` for the current user.

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

A convenience method that calls [`fcl.authenticate()`](<##`fcl.authenticate(opts)`>)

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

A convenience method that calls [`fcl.authenticate()`](<##`fcl.authenticate(opts)`>) with no options.

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

A convenience method that produces the needed authorization details for the current user to submit transactions to Flow.

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
  fcl.proposer(fcl.authz), // use as a alias when authorizing transactions
  fcl.payer(fcl.authz),
  fcl.authorizations([fcl.authz]),
  fcl.limit(1000),
]);
```

### Examples

- [Authorize a transaction](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

# On-chain Interactions

These methods allows dapps to interact directly with the Flow blockchain via a set of functions that wrap the [Access Node API](https://docs.onflow.org/access-api/) along with utilities to make it easier to send and decode responses. This set of functionality is similar to what is offered in other [SDKs](https://google.ca).

> :loudspeaker: **These methods can be used both on the client and server.**

## Methods

---

## `fcl.send([...builders])`

Sends arbitrary scripts and transactions to the Flow Blockchain's [Access Node API](https://docs.onflow.org/access-api/).

It consumes an array of [builders](https://google.ca) that are to be resolved and sent. The interactions required to be included in the array depend on the script or transaction that is being built.

### Note

:warning: Must be used in conjuction with [`fcl.decode()`](#Methods) to get back values in JSON.

:loudspeaker: Some common utility interactions that will be resolved for you (and thus can be passed in directly as an array element) are:

- [`fcl.getAccount()`](<##`fcl.getAccount()`>)
- [`fcl.getEventsAtBlockHeightRange()`](<##`fcl.getEventsAtBlockHeightRange()`>)
- [`fcl.getBlock()`](##`fcl.getAccount`)

### Arguments

| Name            | Type                              | Description                                                                                                                                         |
| --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[...builders]` | Array: [[...builders]](#Builders) | Should contain a `fcl.script` or a `fcl.transaction` along with any relevant builders needed to resolve any arguments to the script or transaction. |

### Returns

| Type            | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| string(encoded) | A raw string response from Cadence that needs to be parsed via `fcl.decode()`. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// a script only needs to resolve the arguments to the script
const response = await fcl.send([fcl.script`${script}`, fcl.args(args)]);
// note: response is encoded, call await fcl.decode(response) to get JSON

// a transaction requires multiple 'interactions' that need to be resolved prior to sending for executed to Flow - such as setting the authorizations.
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

Decodes the raw string returned from Cadence into regular JSON consumable by javascript.

### Note

:loudspeaker: To decode custom structs and define your custom decoding, see [`tutorial`](<##`fcl.decode()`>).

### Arguments

| Name       | Type            | Description                                                       |
| ---------- | --------------- | ----------------------------------------------------------------- |
| `response` | string(encoded) | Should be the raw string response returned from `fcl.send([...])` |

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

## Methods

---

## `fcl.getAccount(address)`

A builder function that returns the script template to get an account by address.
:warning: Ensure there is no prefix on the address by calling `fcl.sansPrefix(address)`

### Arguments

| Name      | Type                   | Description                                   |
| --------- | ---------------------- | --------------------------------------------- |
| `address` | [Address](##`Address`) | Address of the user account without a prefix. |

### Returns

| Type                           | Description                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| [Interaction](##`Interaction`) | A populated cadence script that contains the code and values needed to get an account. |

### Return from `fcl.send([fcl.getAccount(address)])`

| Type                         | Description     |
| ---------------------------- | --------------- |
| [AccountObject](##`Account`) | A user account. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// somewhere in an async function
getAccount = async (address: string) => {
  const { account } = await fcl.send([fcl.getAccount(address)]);
  return account;
};
```

---

## `fcl.getLatestBlock(isSealed)`

A builder function that returns the script template to get the latest block.

### Arguments

| Name      | Type                   | Description                                   |
| --------- | ---------------------- | --------------------------------------------- |
| `isSealed` | (optional) boolean | If the latest block requested should be sealed or not. See [Block State](#BlockState). |

### Returns

| Type                           | Description                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| [Interaction](##`Interaction`) | A populated cadence script that contains the code and values needed to get an account. |

### Return from `fcl.send([fcl.getLatestBlock(isSealed)])`

| Type                         | Description     |
| ---------------------------- | --------------- |
| [BlockObject](##`BlockObject`) |The latest block. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// somewhere in an async function
getLatestBlock = async (address: string) => {
  const { block } = await fcl.send([fcl.getLatestBlock(isSealed)]);
  return block;
};
```

---

## `fcl.getEventsAtBlockHeightRange(eventName,fromBlock,toBlock)`

A builder function that returns all instances of a particular event (by name) within a height range.
:warning: The block range provided must be from the current spork. All events emitted during past sporks is current unavailable.
:warning: The block range provided must be 250 blocks or lower per request.

### Arguments

| Name        | Type   | Description                                                      |
| ----------- | ------ | ---------------------------------------------------------------- |
| `eventName` | [EventName]](##`EventName`) | The name of the event.                    |
| `fromBlock` | number | The height of the block to start looking for events (inclusive). |
| `toBlock`   | number | The height of the block to stop looking for events (inclusive).  |

### Returns

| Type                           | Description                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| [Interaction](##`Interaction`) | A populated cadence script that contains the code and values needed to get events within a block range. |

### Return from `fcl.send([fcl.getEventsAtBlockHeightRange(eventName,fromBlock,toBlock)])`

| Type                         | Description     |
| ---------------------------- | --------------- |
| [[EventObject]](##`EventObject`) | An array of events that matched the eventName. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// somewhere in an async function
getAccount = async (address: string) => {
  const { account } = await fcl.send([fcl.getAccount(address)]);
  return account;
};
```

---

# Types

## `Builders`

Builders are modular functions that can be coupled together with `fcl.send([...builders])` to create an [Interaction](##`Interaction`). The builders needed to create an interaction depend on the script or transaction that is being sent.

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

This is the JSON representation of an account on the Flow blockchain.
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

## `EventName`

| Value Type        | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
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

This is the JSON representation of a key on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `id` | string | The id of the block. |
| `parentId` | string | The id of the parent block. |
| `height` | number | The height of the block. |
| `timestamp` | object | Contains time related fields. |
| `collectionGuarantees` | [] | ??? |
| `blockSeals` | [[SealedBlockObject]](##`SealedBlockObject`) | The details of which nodes executed and sealed the blocks. |
| `signatures` | Uint8Array([numbers]) | All signatures. |
