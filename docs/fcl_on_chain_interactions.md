# On-chain Interactions

> :loudspeaker: **These methods can be used both on the client and server.**

These methods allows dapps to interact directly with the Flow blockchain via a set of functions that currently use the [Access Node API](https://docs.onflow.org/access-api/) along with some other utilities to make it easier to send and decode responses. This set of functionality is similar to what is offered in other [SDKs](https://docs.onflow.org/sdks/) but allows for greater composability and customizability.

**In general, all interactions need to be built and sent to the chain via `fcl.send()` and then decoded via `fcl.decode()` with the exception below.**

:warning: **To simplify the send and decode pattern, FCL introduced [`fcl.query`](#TODO) and [`fcl.mutate`](#TODO)**. :tomato: UNSURE: Eventually, FCL will abstract most functionality offered by builders into these methods, but until then, there are still some cases where you will need to use builders - specifically for polling events, running scripts or transactions at a historical block, and ... :tomato: WHAT ELSE?.

## Methods

---

## Query and mutate the blockchain with Cadence

If you want to run arbitrary Cadence scripts on the blockchain, these methods offer a convenient way to do so **without having to build, send, and decode interactions**.

## `fcl.query({...options})`

### Options

_Pass in the following as a single object with the following keys.All keys are optional unless otherwise stated._

| Key       | Type                                     | Description                                                                                                 |
| --------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `cadence` | string **(required)**                    | A valid cadence script.                                                                                     |
| `args`    | [ArgumentFunction](##`ArgumentFunction`) | Any arguments to the script if needed should be supplied via a function that returns an array of arguments. |
| `limit`   | number                                   | Compute limit for query. :tomato: WHAT UNITS ARE THESE IN?                                                  |

### Returns

| Type | Description                            |
| ---- | -------------------------------------- |
| any  | A JSON representation of the response. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const result = await fcl.query({
  cadence: `
    pub fun main(a: Int, b: Int, addr: Address): Int {
      log(addr)
      return a + b
    }
  `,
  args: (arg, t) => [
    arg(7, t.Int), // a: Int
    arg(6, t.Int), // b: Int
    arg("0xba1132bc08f82fe2", t.Address), // addr: Address
  ],
});
console.log(result); // 13
```

### Examples

- Coming Soon

---

## `fcl.mutate({...options})`

### Options

_Pass in the following as a single object with the following keys.All keys are optional unless otherwise stated._

| Key        | Type                                               | Description                                                                                                                                   |
| ---------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `cadence`  | string **(required)**                              | A valid cadence transaction.                                                                                                                  |
| `args`     | [ArgumentFunction](##`ArgumentFunction`)           | Any arguments to the script if needed should be supplied via a function that returns an array of arguments.                                   |
| `limit`    | number                                             | Compute limit for query. :tomato: WHAT UNITS ARE THESE IN?                                                                                    |
| `proposer` | [AuthorizationFunction](##`AuthorizationFunction`) | The authorization function that returns a valid [AuthorizationObject](##`AuthorizationObject`) for the [proposer role](##`TransactionRoles`). |

### Returns

| Type   | Description         |
| ------ | ------------------- |
| string | The transaction ID. |

---

## Query and mutate the blockchain with Builders

In some cases, you may want to build more complex interactions than what the `fcl.query` and `fcl.mutate` interface offer. To do this, FCL uses a pattern of building up an interaction with a combination of builders, resolving them, and sending them to the chain.

> :warning: **Recommendation:** Unless you have a specific use case that require usage of these builders, you should be able to achieve most cases with `fcl.query({...options}` or `fcl.mutate({...options})`

## `fcl.send([...builders])`

Sends arbitrary scripts, transactions, and requests to the blockchain.

It consumes an array of [builders](https://google.ca) that are to be resolved and sent. The builders required to be included in the array depend on the [interaction](##`Interactions`) that is being built.

### Note

:warning: Must be used in conjuction with [`fcl.decode(response)`](<##`fcl.decode(response)`>) to get back correct keys and all values in JSON.

### Arguments

| Name       | Type                      | Description            |
| ---------- | ------------------------- | ---------------------- |
| `builders` | [[Builders]](#`Builders`) | See builder functions. |

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
// note: response contains several values (Cad)
```

### Examples

- [Getting a user account](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Getting the latest block](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Sending a transaction](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.decode(response)`

Decodes the response from `fcl.send()` into the appropriate JSON representation of all relevant keys and values.

### Note

:loudspeaker: To define your own decoder, see [`tutorial`](#TODO).

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

## Builders

These methods fill out various portions of a transaction or script template in order to
build, resolve, and send it to the blockchain. A valid populated template is referred to as an [Interaction](##`Interaction`).

:warning: **These methods must be used with `fcl.send([...builders]).then(fcl.decode)`**

### Query Builders

## `fcl.getAccount(address)`

A builder function that returns the interaction to get an account by address.

:warning: Consider using the pre-built interaction [`fcl.account(address)`](<##`fcl.account(address)`>) if you do not need to pair with any other builders.

### Arguments

| Name      | Type                   | Description                                                                        |
| --------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `address` | [Address](##`Address`) | Address of the user account with or without a prefix (both formats are supported). |

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

:warning: Consider using the pre-built interaction [`fcl.latestBlock(isSealed)`](<##`fcl.latestBlock(isSealed)`>) if you do not need to pair with any other builders.

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

## `fcl.atBlockHeight(blockHeight)`

A builder function that returns a partial interaction to a block at a specific height.

:warning: Use with other interactions like [`fcl.getBlock()`](<##`fcl.getBlock(isSealed)`>) to get a full interaction at the specified block height.

### Arguments

| Name          | Type   | Description                                            |
| ------------- | ------ | ------------------------------------------------------ |
| `blockHeight` | number | The height of the block to execute the interaction at. |

### Returns

| Type                                   | Description                                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](##`Interaction`) | A partial interaction to be paired with another interaction such as `fcl.getBlock()` or `fcl.getAccount()`. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl.send([fcl.getBlock(), fcl.atBlockHeight(123)]).then(fcl.decode);
```

---

## `fcl.atBlockId(blockId)`

A builder function that returns a partial interaction to a block at a specific block ID.

:warning: Use with other interactions like [`fcl.getBlock()`](<##`fcl.getBlock(isSealed)`>) to get a full interaction at the specified block ID.

### Arguments

| Name      | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `blockId` | string | The ID of the block to execute the interaction at. |

### Returns

| Type                                   | Description                                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](##`Interaction`) | A partial interaction to be paired with another interaction such as `fcl.getBlock()` or `fcl.getAccount()`. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl.send([fcl.getBlock(), fcl.atBlockId("23232323232")]).then(fcl.decode);
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
    fcl.getEventsAtBlockIds("A.7e60df042a9c0868.FlowToken.TokensWithdrawn", [
      "c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7",
      "5dbaa85922eb194a3dc463c946cc01c866f2ff2b88f3e59e21c0d8d00113273f",
    ]),
  ])
  .then(fcl.decode);
```

---

## `fcl.getTransactionStatus(transactionId)`

A builder function that returns the status of transaction.

:warning: The transactionID provided must be from the current spork.
:loudspeaker: Considering [subscribing to the transaction from `fcl.tx(id)`](<##`fcl.tx(transactionId)>) instead of calling this method directly.

### Arguments

| Name            | Type   | Description                                                                                                                           |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `transactionId` | string | The transactionID returned when submitting a transaction. Example: `9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3` |

### Returns after decoding

| Name           | Type                                         | Description                                                     |
| -------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `events`       | [[EventObject]](##`EventObject`)             | An array of events that were emitted during the transaction.    |
| `status`       | [TransactionStatus](##`TransactionStatuses`) | The status of the transaction on the blockchain.                |
| `errorMessage` | string                                       | An error message if it exists. Default is an empty string `''`. |
| `statusCode`   | [GRPCStatus](##`GRPCStatuses`)               | The status from the GRPC response.                              |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const status = await fcl
  .send([
    fcl.getTransactionStatus(
      "9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3"
    ),
  ])
  .then(fcl.decode);
```

---

## `fcl.getTransaction(transactionId)`

A builder function that returns a [transaction object](##TransactionObject>) once decoded.

:warning: The transactionID provided must be from the current spork.
:loudspeaker: Considering using [`fcl.tx(id).onceSealed()`](<##`fcl.tx(transactionId)>) instead of calling this method directly.

### Arguments

| Name            | Type   | Description                                                                                                                           |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `transactionId` | string | The transactionID returned when submitting a transaction. Example: `9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3` |

### Returns after decoding

| Name           | Type                                       | Description                                                     |
| -------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `events`       | [[EventObject]](##`EventObject`)           | An array of events that matched the eventName.                  |
| `status`       | [TransactionStatus](##`TransactionStatus`) | The status of the transaction on the blockchain.                |
| `errorMessage` | string                                     | An error message if it exists. Default is an empty string `''`. |
| `statusCode`   | [GRPCStatus](##`TransactionStatus`)        | The status from the GRPC response.                              |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const tx = await fcl
  .send([
    fcl.getTransaction(
      "9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3"
    ),
  ])
  .then(fcl.decode);
```

---

## `fcl.getEvents(eventName,fromBlock,toBlock)` - Deprecated

Use [`fcl.getEventsAtBlockHeightRange`](##`fcl.getEventsAtBlockHeightRange`) or [`fcl.getEventsAtBlockIds`](##`fcl.getEventsAtBlockIds`).

---

## `fcl.getLatestBlock(isSealed)` - Deprecated

Use [`fcl.getBlock`](##`fcl.getBlock`).

---

## `fcl.getBlockById(blockId)` - Deprecated

Use [`fcl.getBlock`](##`fcl.getBlock`) and [`fcl.atBlockId`](##`fcl.atBlockId`).

---

## `fcl.getBlockByHeight(blockHeight)` - Deprecated

Use [`fcl.getBlock`](##`fcl.getBlock`) and [`fcl.atBlockHeight`](##`fcl.atBlockHeight`).

---

## Utility Builders

These builders are used to compose interactions with other builders such as scripts and transactions.

> :warning: **Recommendation:** Unless you have a specific use case that require usage of these builders, you should be able to achieve most cases with `fcl.query({...options}` or `fcl.mutate({...options})`

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
  .then(fcl.decode); // 9
```

---

## Template Builders

> :warning: **_Deprecating soon_**. Unless you have a specific use case that require usage of these builders, you should be able to achieve most cases with `fcl.query({...options}` or `fcl.mutate({...options})`

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

| Type                                   | Description                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [Partial Interaction](##`Interaction`) | An partial interaction containing the code passed in. Further builders are required to complete the interaction - see warning. |

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

## Pre-built Interactions

These functions are abstracted short hand ways to skip the send and decode steps of sending an interaction to the chain. More pre-built interactions are coming soon.

## `fcl.account(address)`

A pre-built interaction that returns the details of an account from their public address.

### Arguments

| Name      | Type                   | Description                                                                        |
| --------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `address` | [Address](##`Address`) | Address of the user account with or without a prefix (both formats are supported). |

### Returns

| Type                         | Description                              |
| ---------------------------- | ---------------------------------------- |
| [AccountObject](##`Account`) | A JSON representation of a user account. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
const account = await fcl.account("0x1d007d755706c469");
```

---

## `fcl.latestBlock(isSealed)`

A pre-built interaction that returns the latest block (optionally sealed or not).
:tomato: UNSURE OF THE ARGUMENTS.

### Arguments

| Name       | Type    | Default | Description                                                                       |
| ---------- | ------- | ------- | --------------------------------------------------------------------------------- |
| `isSealed` | boolean | false   | If the latest block should be sealed or not. See [block states](##`Interaction`). |

### Returns

| Type                           | Description                       |
| ------------------------------ | --------------------------------- |
| [BlockObject](##`BlockObject`) | A JSON representation of a block. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
const latestBlock = await fcl.latestBlock();
```

---

## Transaction Status Utility

## `fcl.tx(transactionId)`

A utility function that lets you set the transaction to get subsequent status updates (via polling) and the finalized result once available.
:warning: The poll rate is set at `2500ms` and will update at that interval until transaction is sealed.

### Arguments

| Name            | Type   | Description             |
| --------------- | ------ | ----------------------- |
| `transactionId` | string | A valid transaction id. |

### Returns

| Name              | Type     | Description                                                                                                 |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `snapshot()`      | function | Returns the current state of the transaction.                                                               |
| `subscribe(cb)`   | function | Calls the `cb` passed in with the new transaction on a status change.                                       |
| `onceFinalized()` | function | Provides the transaction once status `2` is returned. See [Tranasaction Statuses](##`TransactionStatuses`). |
| `onceExecuted()`  | function | Provides the transaction once status `3` is returned. See [Tranasaction Statuses](##`TransactionStatuses`). |
| `onceSealed()`    | function | Provides the transaction once status `4` is returned. See [Tranasaction Statuses](##`TransactionStatuses`). |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const [txStatus, setTxStatus] = useState(null);
useEffect(() => fcl.tx(txId).subscribe(setTxStatus));
```

### Examples

- [React Effect to get the transaction status on submit](https://github.com/onflow/flow-port/blob/staging/src/pages/transaction-status.js#L158-L183)
- Kitty items example :tomato: Fill in

---

## Event Polling Utility

## `fcl.events(eventName)`

A utility function that lets you set the transaction to get subsequent status updates (via polling) and the finalized result once available.
:warning: The poll rate is set at `10000ms` and will update at that interval for getting new events.

### Arguments

| Name        | Type   | Description         |
| ----------- | ------ | ------------------- |
| `eventName` | string | A valid event name. |

### Returns

| Name            | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `subscribe(cb)` | function | Calls the `cb` passed in with the new event. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const { eventKey } = useParams();
const [events, setEvents] = useState([]);
useEffect(
  () =>
    fcl.events(eventKey).subscribe((event) => {
      setEvents((oldEvents) => [...oldEvents, event]);
    }),
  [eventKey]
);
```

### Examples

- Flow view source example :tomato: Fill in

---