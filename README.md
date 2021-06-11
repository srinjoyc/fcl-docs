# Flow Client Library (FCL) API Reference

**Version**: 0.70.0

**Last Updated**: June 10th, 2021

**Github**: https://github.com/onflow/flow-js-sdk/

# Wallet Interactions

These methods allows dapps to interact with wallet services in order to authenticate the user and authorize transactions on their behalf.

> :warning: **These methods can only be used client side.**

## Methods

---

## `fcl.authenticate(opts)`

Used to authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `challenge.handshake` endpoint or default to the `discovery.wallet` endpoint which lets the user select a supported custodial wallet ([see supported wallets](#Wallets)).

### Note

:warning: Either `challenge.handshake` or `discovery.wallet` values **must** be set in the configuration before calling this method. See [FCL Configuration](#Methods).

:loudspeaker: Should only be used if using a different set of authentication options are needed rather than the default. Use the aliases [`fcl.login()`](<##`fcl.login()`>) or [`fcl.signup()`](<##`fcl.signUp()`>) instead.

:loudspeaker: The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.

### Arguments

| Name   | Type                                                        | Description                                                                                                                   | Default                                      |
| ------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `opts` | (optional) Object:[ServiceStrategy](#Types#ServiceStrategy) | Specifies which endpoint to use to initiate the handshake and how to communicate with it.<br> :warning: Defaults reccomended. | `{ serviceStrategy: ServiceStrategy.frame }` |

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
fcl.unauthenticate();
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
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.unauthenticate();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.login()`

A convenience method that calls [`fcl.authenticate()`](<##`fcl.authenticate(opts)`>) with no options.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// anywhere on the page
fcl.login();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.signUp()`

A convenience method that calls [`fcl.authenticate()`](<##`fcl.authenticate(opts)`>) with no options. Equivalent to [`fcl.login()`](<##`fcl.login()`>).

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// anywhere on the page
fcl.signUp();
```

### Examples

- [React Hook to manage FCL authentication](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.authz`

A convenience method that produces the needed authorization details for the current user to submit transactions to Flow.

### Returns

| Type                                               | Description                                                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Object: [UserAuthorization](##`UserAuthorization`) | An object containing the necessary details from the current user to authorize a transaction in any role. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// anywhere on the page
console.log(fcl.authz);
// prints {addr, signingFunction, keyId, sequenceNum} from the current user.

// use as a alias when authorizing transactions
const response = fcl.send([
  fcl.transaction(CODE),
  fcl.args([
    fcl.arg(Number(itemID), t.UInt64),
    fcl.arg(String(price), t.UFix64),
  ]),
  fcl.proposer(fcl.authz),
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

## `fcl.send([...interactions])`

Sends arbitrary scripts and transactions to the Flow Blockchain's [Access Node API](https://docs.onflow.org/access-api/).

It consumes an array of [interactions](https://google.ca) that are to be resolved and sent. The interactions required to be included in the array depend on the script or transaction that is being built.

### Note

:warning: Must be used in conjuction with [`fcl.decode()`](#Methods) to get back values in JSON.

:loudspeaker: Some common utility interactions that will be resolved for you (and thus can be passed in directly as an array element) are:

- [`fcl.getAccount()`](<##`fcl.getAccount()`>)
- [`fcl.getEventsAtBlockHeightRange()`](<##`fcl.getEventsAtBlockHeightRange()`>)
- [`fcl.getBlock()`](##`fcl.getAccount`)

### Arguments

| Name                | Type                                               | Description                                                                                                            |
| ------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `[...interactions]` | Array: [[...Interactions]](#Types#ServiceStrategy) | Should contain a `fcl.script` or a `fcl.transaction` along with the relevant interactions needed to build and resolve. |

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
import * as sdk from "@onflow/fcl";
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

## `fcl.getAccount(response)`

A pre-built interaction

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
import * as sdk from "@onflow/fcl";
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

# Types

## `ServiceStrategy`

An interface that is used to determine how to authenticate the user relative to the configured wallet providers.
:warning: Use defaults where possible.

### Object

| Key  | Value Type | Description |
| ---- | ---------- | ----------- |
| `na` | na         | na          |

## `Interactions`

Please read the guide on [FCL Interactions](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js). <br> :loudspeaker: Any function that returns a pre-built interaction in FCL is noted on the function in this reference.

## `UserAuthorization`

This type conforms to the interface required for FCL to authorize transaction on behalf o the current user.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `addr` | [Address](##`Address`) | The address of the authorizer |
| `signingFunction` | function | A function that allows FCL to sign using the authorization details. |
| `keyId` | number | The index of the key to use during authorization. (Multiple keys on an account is possible). |
| `sequenceNum` | number | A number that is incremented per transaction using they keyId. |

## `Address`

| Value Type        | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A valid Flow address should be 16 characters in length. <br>A `0x` prefix is optional during inputs. <br>eg. `f8d6e0586b0a20c1` |
