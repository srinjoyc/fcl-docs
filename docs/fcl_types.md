# Types, Interfaces, and Definitions

---

## `Builders`

Builders are modular functions that can be coupled together with `fcl.send([...builders])` to create an [Interaction](##`Interactions`). The builders needed to create an interaction depend on the script or transaction that is being sent.

---

## `Interactions`

An interaction is a a template containing a valid string of Cadence code that is either a valid script or transaction. Please read the guide on [FCL Interactions](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js).

---

## `CurrentUserObject`

| Key         | Value Type             | Default   | Description                                                                                                                                                       |
| ----------- | ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addr`      | [Address](##`Address`) | `null`    | The public address of the current user                                                                                                                            |
| `cid`       | string                 | `null`    | :tomato: TODO                                                                                                                                                     |
| `expiresAt` | number                 | `null`    | If the current session expires the value will be non-null. :tomato: UNSURE                                                                                        |
| `f_type`    | string                 | `'USER'`  | A type identifier used internally by FCL.                                                                                                                         |
| `f_vsn`     | string                 | `'1.0.0'` | The version to use when passing messages between the provider and the dapp. :tomato: UNSURE                                                                       |
| `loggedIn`  | boolean                | `null`    | If the user is logged in.                                                                                                                                         |
| `services`  | [ServiceObject]        | `[]`      | A list of services that offer specific functionality (eg. authorization) from the wallet provider to the logged in user. :tomato: More documentation coming soon. |

---

## `AuthorizationObject`

This type conforms to the interface required for FCL to authorize transaction on behalf o the current user.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `addr` | [Address](##`Address`) | The address of the authorizer |
| `signingFunction` | function | A function that allows FCL to sign using the authorization details and produce a valid signature. |
| `keyId` | number | The index of the key to use during authorization. (Multiple keys on an account is possible). |
| `sequenceNum` | number | A number that is incremented per transaction using they keyId. |

---

## `SignableObject`

An object that contains all the information needed for FCL to sign a message with the user's signature.

| Key         | Value Type             | Description                                                                                            |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `addr`      | [Address](##`Address`) | The address of the authorizer                                                                          |
| `keyId`     | number                 | The index of the key to use during authorization. (Multiple keys on an account is possible).           |
| `signature` | function               | A [SigningFunction](##`SigningFunction`) that can produce a valid signature for a user from a message. |

---

## `AccountObject`

The JSON representation of an account on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `address` | [Address](##`Address`) | The address of the account |
| `balance` | number | The FLOW balance of the account in 10\*6. |
| `code` | [Code](##`Code`) | ???? |
| `contracts` | Object: [Contract](##`contract`) | An object with keys as the contract name deployed and the value as the the cadence string. |
| `keys` | [[KeyObject]](##`Key`) | Any contracts deployed to this account. |

---

## `Address`

| Value Type        | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A valid Flow address should be 16 characters in length. <br>A `0x` prefix is optional during inputs. <br>eg. `f8d6e0586b0a20c1` |

---

## `ArgumentObject`

An argument object created by `fcl.arg(value,type)`
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `value` | any | Any value to be used as an argument to a builder. |
| `xform` | [FType](##`FType`) | Any of the supported types on Flow. |

---

## `ArgumentFunction`

An function that takes the `fcl.arg` function and fcl types `t` and returns an array of `fcl.arg(value,type)`.

`(arg, t) => Array<Arg>`

| Parameter Name | Value Type          | Description                                                                  |
| -------------- | ------------------- | ---------------------------------------------------------------------------- |
| `arg`          | function            | A function that returns an [ArgumentObject](##`ArgumentObject`) - `fcl.arg`. |
| `t`            | [FTypes](##`FType`) | An object with acccess to all of the supported types on Flow.                |

**Returns**
| Value Type | Description |
|----------- | ----------- |
| `[fcl.args]` | Array of `fcl.args`. |

---

## `Authorization Function`

An authorization function must produce the information of the user that is going to sign and a signing function to use the information to produce a signature.

:warning: This function is always async.

:loudspeaker: By default FCL exposes `fcl.authz` that produces the authorization object for the current user (given they are signed in and only on the browser). Replace this with your own function that conforms to this interface to use it wherever an authorization object is needed.

| Parameter Name | Value Type                         | Description                                    |
| -------------- | ---------------------------------- | ---------------------------------------------- |
| `account`      | [AccountObject](##`AccountObject`) | The account of the user that is going to sign. |

**Returns**
| Value Type | Description |
|----------- | ----------- |
| Promise<[AuthorizationObject](##`AuthorizationObject`)> | The object that contains all the information needed by FCL to authorize a user's transaction. |

### Usage

---

```javascript
const authorizationFunction = async (account) => {
    // authorization function need to return an account
    const { address, keys } = account
    const tempId = `${address}-${keys[process.env.minterAccountIndex]}`;
    const keyId = Number(KEY_ID);
    let signingFunction = async signable => {
      return {
        keyId,
        addr: fcl.withPrefix(address),
        signature: sign(process.env.FLOW_MINTER_PRIVATE_KEY, signable.message), // signing function, read below
      }
    }
    return {
    ...account,
    address,
    keyId,
    tempId,
    signingFunction,
  }
```

### Examples:

- [Node.js Service using the service account to authorize a minter](https://github.com/onflow/kitty-items/blob/master/api/src/services/flow.ts)
- [Detailed explanation](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/wallet-provider-spec/authorization-function.md)

---

## `Signing Function`

Consumes a payload and produces a signature for a transaction.

:warning: This function is always async.

:loudspeaker: Only write your own signing function if you are writing your own custom authorization function.

### Payload

Note: These values are destructed from the payload object in the first argument.

| Parameter Name | Value Type | Description                                                                                                                          |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `message`      | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `addr`         | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `keyId`        | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `roles`        | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `voucher`      | object     | The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message. |

**Returns**
| Value Type | Description |
|----------- | ----------- |
| Promise<[SignableObject](##`SignableObject`)> | The object that contains all the information needed by FCL to authorize a user's transaction. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
const ec: EC = new EC("p256");

const produceSignature = (privateKey, msg) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(this.hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

const signingFunction = ({
  message, // The encoded string which needs to be used to produce the signature.
  addr, // The address of the Flow Account this signature is to be produced for.
  keyId, // The keyId of the key which is to be used to produce the signature.
  roles: {
    proposer, // A Boolean representing if this signature to be produced for a proposer.
    authorizer, // A Boolean representing if this signature to be produced for a authorizer.
    payer, // A Boolean representing if this signature to be produced for a payer.
  },
  voucher, // The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message.
}) => {
  return {
    addr, // The address of the Flow Account this signature was produced for.
    keyId, // The keyId for which key was used to produce the signature.
    signature: produceSignature(message), // The hex encoded string representing the signature of the message.
  };
};
```

### Examples:

- [Node.js Service using the service account to authorize a minter](https://github.com/onflow/kitty-items/blob/master/api/src/services/flow.ts)
- [Detailed explanation](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/wallet-provider-spec/authorization-function.md)

---

## `TransactionRolesObject`

| Key Name   | Value Type | Description                                                                |
| ---------- | ---------- | -------------------------------------------------------------------------- |
| proposer   | boolean    | A Boolean representing if this signature to be produced for a proposer.    |
| authorizer | boolean    | A Boolean representing if this signature to be produced for an authorizer. |
| payer      | boolean    | A Boolean representing if this signature to be produced for a payer.       |

For more on what each transaction role means, see [singing roles](https://docs.onflow.org/concepts/transaction-signing/#signer-roles).

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

The format of all responses in FCL returned from `fcl.send(...)`. For full details on the values and descriptions of the keys, view [here](https://github.com/onflow/flow-js-sdk/tree/master/packages/sdk/src/response).
| Key |
| ---- |
| `tag` |
| `transaction` |
| `transactionStatus` |
| `transactionId` |
| `encodedData` |
| `events` |
| `account` |
| `block` |
| `blockHeader` |
| `latestBlock` |
| `collection` |

## `Event Object`

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

## `Transaction Statuses`

The status of a transaction will depend on the Flow blockchain network and which phase it is in as it completes and is finalized.
| Status Code | Description |
| ----------- | ----------- |
| `0` | Unknown
| `1` | Transaction Pending - Awaiting Finalization
| `2` | Transaction Finalized - Awaiting Execution
| `3` | Transaction Executed - Awaiting Sealing
| `4` | Transaction Sealed - Transaction Complete
| `5` | Transaction Expired
:tomato: TODO better descriptions.

## `GRPC Statuses`

The access node GRPC implementation follows the standard GRPC Core status code spec. View [here](https://grpc.github.io/grpc/core/md_doc_statuscodes.html).

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

---
