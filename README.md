# Flow Client Library (FCL) Reference

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

# On-chain Interactions

These methods allows dapps to interact directly with the Flow blockchain via a set of functions that wrap the [Access Node API](https://docs.onflow.org/access-api/) along with utilities to make it easier to send and decode responses. This set of functionality is similar to what is offered in other [SDKs](https://google.ca).

> :loudspeaker: **These methods can be used both on the client and server.**

## Methods
---

## `fcl.send([...interactions])`

This function consumes an array of intera
Consumes an Interaction and some configuration, and returns a data structure called a Response

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

# Types

## ServiceStrategy
