# Flow Client Library (FCL) Reference

**Version**: 0.70.0

**Last Updated**: June 10th, 2021

**Github**: https://github.com/onflow/flow-js-sdk/

# Wallet Interactions

These methods allows dapps to interact with wallet services in order to authenticate the user and authorize transactions on their behalf.

> :warning: **These methods can only be used client side.**

## Methods


## `fcl.authenticate(opts)`

Used to authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `challenge.handshake` endpoint or default to the `discovery.wallet` endpoint which lets the user select a supported custodial wallet ([see supported wallets](#Wallets)).

### Note

:warning: Either `challenge.handshake` or `discovery.wallet` values **must** be set in the configuration before calling this method. See [FCL Configuration](#Methods).

:loudspeaker: Should only be used if using a different set of authentication options are needed rather than the default. Use [`fcl.login()`](#Types) or [`fcl.signup()`](#Types) instead.

:loudspeaker: The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.

### Arguments

| Name   | Type                                                        | Description                                                                                                                   | Default                                      |
| ------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `opts` | (optional) Object:[ServiceStrategy](#Types#ServiceStrategy) | Specifies which endpoint to use to initiate the handshake and how to communicate with it.<br> :warning: Defaults reccomended. | `{ serviceStrategy: ServiceStrategy.frame }` |

### Usage

```javascript
import * as fcl from "@onflow/fcl"
// anywhere on the page
fcl.authenticate();
```
### Examples
- [Creating an sign up and login react hook](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

## `fcl.unauthenticate()`

This will logout the current user.

### Usage

```javascript
// anywhere on the page
fcl.unauthenticate();
```
### Examples
- [Creating an sign up and login react hook](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---
# Types

## ServiceStrategy
