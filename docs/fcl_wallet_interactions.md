# Wallet Interactions

These methods allows dapps to interact with [supported wallet services](#TODO) in order to authenticate the user and authorize transactions on their behalf.

## Methods

---

## `fcl.authenticate()`

> :warning: **This method can only be used client side.**

Used to authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `discovery.wallet` endpoint which lets the user select a wallet to login or sign up with. Once the wallet provider has authenticated the user, FCL will set the values on the [current user](#TODO) object.

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

Logs out the current user and sets the values on the [current user](#TODO) object to null.

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
// fcl.currentUser().loggedIn === null
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

A **convenience method** that calls [`fcl.authenticate()`](#fcltransactioncode).

---

## `fcl.login()`

> :warning: **This method can only be used client side.**

A **convenience method** that calls [`fcl.authenticate()`](<##`fcl.authenticate()`>).

---

## `fcl.authz`

A **convenience method** that produces the needed authorization details for the current user to submit transactions to Flow. It defines a signing function that will be used with the current user's details to produce signatures to submit transactions.

### Returns

| Type                                           | Description                                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [AuthorizationObject](##`AuthorizationObject`) | An object containing the necessary details from the current user to authorize a transaction in any role. |

### Usage

**Note:** The `fcl.mutate` example below is showing how `fcl.authz` is used under the hood. The default values for `proposer`, `payer`, and `authorizations` are already `fcl.authz` so there is no need to include these parameters.

```javascript
import * as fcl from "@onflow/fcl";
// login somewhere before
fcl.authenticate();
// once logged in authz will produce values
console.log(fcl.authz);
// prints {addr, signingFunction, keyId, sequenceNum} from the current authenticated user.

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: AuthAccount) {
        account.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg("myName", t.String)],
  proposer: fcl.authz, // optional - default is fcl.authz
  payer: fcl.authz, // optional - default is fcl.authz
  authorizations: [fcl.authz], // optional - default is [fcl.authz]
});
```

### Examples

- [Node Service to authorize transactions using builders](https://github.com/onflow/kitty-items/blob/master/api/src/services/flow.ts) - it is reccomended to use `fcl.mutate` instead of `fcl.send(...).then(fcl.decode)`

---

## Current User

Holds the [current user](##`CurrentUserObject`) if set and offers a set of functions to manage the authentication and authorization of the user.

> :warning: **The following methods can only be used client side.**

## Methods

---

## `fcl.currentUser().subscribe(callback)`

A method to use with your state management tool of choice to set and unset the current user based on the authentication functions.

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

---

## `fcl.currentUser().snapshot()`

Returns the [current user](##`CurrentUserObject`) object. This is the same object that is set and available on [`fcl.currentUser().subscribe(callback)`](<##`fcl.currentUser().subscribe(callback)`>).

---

## `fcl.currentUser().authenticate()`

Equivalent to `fcl.authenticate()` **(recommended)**.

---

## `fcl.currentUser().unauthenticate()`

Equivalent to `fcl.unauthenticate()` **(recommended)**.

---

## `fcl.currentUser().authorization()`

Equivalent to `fcl.authz` **(recommended)**.

---

## `fcl.currentUser().signUserMessage(msg, opts)`

:tomato: Coming soon.

---