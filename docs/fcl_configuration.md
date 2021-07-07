# Configuration

FCL has a mechanism that lets you configure various aspects of FCL. When you move from one instance of the Flow Blockchain to another (Local Emulator to Testnet to Mainnet) the only thing you should need to change for your FCL implementation is your configuration.

---

## Setting Configuration Values

Values only need to be set once. We recommend doing this once and as early in the life cycle as possible. To set a configuration value, the `put` method on the `config` instance needs to be called, the `put` method returns the `config` instance so they can be chained.

```javascript
import * as fcl from "@onflow/fcl";

fcl
  .config() // returns the config instance
  .put("foo", "bar") // configures "foo" to be "bar"
  .put("baz", "buz"); // configures "baz" to be "buz"
```

## Getting Configuration Values

The `config` instance has an **asynchronous** `get` method. You can also pass it a fallback value.

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

| Name                            | Example                                              | Description                                                                                               |
| ------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `accessNode.api` **(required)** | `https://access-testnet.onflow.org`                  | API URL for the Flow Blockchain Access Node you want to be communicating with. See list here.             |
| `env`                           | `testnet`                                            | Used in conjunction with stored interactions. Possible values: `local`, `canarynet`, `testnet`, `mainnet` |
| `discovery.wallet`              | `https://fcl-discovery.onflow.org/testnet/authn`     | Points FCL at the Wallet or Wallet Discovery mechanism.                                                   |
| `app.detail.title`              | `Cryptokitties`                                      | Your applications title, can be requested by wallets and other services.                                  |
| `app.detail.icon`               | `https://fcl-discovery.onflow.org/images/blocto.png` | Url for your applications icon, can be requested by wallets and other services.                           |
| `challenge.handshake`           | **DEPRECATED**                                       | Use `discovery.wallet` instead.                                                                           |

## Address replacement in scripts and transactions

Configuration keys that start with `0x` will be replaced in FCL scripts and transactions, this allows you to write your script or transaction Cadence code once and not have to change it when you point your application at a difference instance of the Flow Blockchain.

```javascript
import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("0xFlowToken", "0x7e60df042a9c0868");

async function myScript() {
  return fcl.query({
    cadence: `
        import FlowToken from 0xFlowToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

        pub fun main(): UFix64 { 
          return FlowToken.totalSupply  // arbitrary script that can access FlowToken interface
        }
      `,
  });
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

---