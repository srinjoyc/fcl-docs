# Flow Client Library (FCL) Reference

Version: 0.70.0

Last Updated: June 10th, 2021

Github: https://github.com/onflow/flow-js-sdk/

# Wallet Interactions
These methods allows dapps to interact with wallet services in order to authenticate the user and authorize transactions on their behalf. 

:warning: **These methods can only be used client side.**

## Methods
## `fcl.authenticate(opts)`
Used to authenticate the current user given a set of options. Once called, FCL will open an iFrame to display options to the user.
:warning: The `challenge.handshake` value **must** be set in the configuration. See [FCL Configuration](#Methods)
:loudspeaker: Should only be used if using a different set of authentication options than the default. Use `fcl.login()` or `fcl.signup` instead.
#### Arguments
-  `(optional) opts: { serviceStrategy: SERVICE_STRATEGY_TYPE }`
	- `(default) { serviceStrategy: FRAME_TYPE }`
#### Usage
```javascript
fcl.authenticate({})
```
## `fcl.unauthenticate()`
This will logout the current user.
:warning: The `challenge.handshake` value must be set in the configuration.
### Usage
```javascript
fcl.authenticate({})
```


# Types
