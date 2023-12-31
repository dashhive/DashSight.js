# [dashsight.js](https://github.com/dashhive/dashsight.js)

SDK for Dash's flavor of the Insight API

# Install

```sh
npm install --save dashsight@1.x
```

To use `WebSocket`s in Node.js:

```sh
npm install --save tough-cookie@4.x ws@8.x
```

# Usage

## Node.js and WebPack

```js
"use strict";

require("dotenv").config({ path: ".env" });

let dashsightBaseUrl =
  process.env.DASHSIGHT_BASE_URL ||
  "https://dashsight.dashincubator.dev/insight-api";
let dashsocketBaseUrl =
  process.env.DASHSOCKET_BASE_URL || "https://insight.dash.org/socket.io";
let insightBaseUrl =
  process.env.INSIGHT_BASE_URL || "https://insight.dash.org/insight-api";

let dashsight = require("dashsight").create({
  dashsightBaseUrl: dashsightBaseUrl,
  dashsocketBaseUrl: dashsocketBaseUrl,
  insightBaseUrl: insightBaseUrl,
});

dashsight.getInstantBalance(address).then(function (info) {
  console.info(`Current balance is: Đ${info.balance}`);
});
```

## Browser

```html
<script src="https://unpkg.com/dashsight@1.2.0/dashsight.js"></script>
<script src="https://unpkg.com/dashsight@1.2.0/dashsocket.js"></script>
```

```js
(async function () {
  let dashsight = window.DashSight.create({
    dashsightBaseUrl: "https://dashsight.dashincubator.dev/insight-api",
    dashsocketBaseUrl: "https://insight.dash.org/socket.io",
    insightBaseUrl: "https://insight.dash.org/insight-api",
  });

  // ...

  await window.DashSocket.listen(
    "https://insight.dash.org/socket.io",
    function finder(evname, data) {
      console.log(evname, data);
    },
    { debug: true },
  );
})();
```

## CLI

You can also use a number of debug commands:

```bash
npx -p dashsight dashsight-balance <addr1> [addr2 ...] [--json]
npx -p dashsight dashsight-instantsend <raw-tx-hex> [--json]
npx -p dashsight dashsight-tx <txid1> [txid2 ...] [--json]
npx -p dashsight dashsight-txs <addr1> [addr2 ...] [--json]
npx -p dashsight dashsight-utxos <addr1> [addr2 ...] [--json]
```

There some curated addresses and txids in [./examples/](/examples/).

# API

| `DashSight.create({ dashsightBaseUrl, dashsocketBaseUrl })` |
| ----------------------------------------------------------- |
| `dashsight.getInstantBalance(addrStr)`                      |
| `dashsight.getTx(txIdHex)`                                  |
| `dashsight.getTxs(addrStr, maxPages)`                       |
| `dashsight.getUtxos(addrStr)`                               |
| `dashsight.instantSend(txHex)`                              |

## DashSight.create({ dashsightBaseUrl, dashsocketBaseUrl })

Creates an instance of the insight sdk bound to the given base urls.

```js
let DashSight = require("dashsight");

let dashsight = DashSight.create({
  dashsightBaseUrl: "https://dashsight.dashincubator.dev/insight-api",
  dashsocketBaseUrl: "https://insight.dash.org/socket.io",
  insightBaseUrl: "https://insight.dash.org/insight-api",
});
```

Note: There are no default base URLs (this is supposed to be used in a
decentralized fashion, after all), but the ones given above are a good starting
point if you don't have your own.

## dashsight.getBalance(address)

**Do not use**. Use `dashsight.getInstantBalance(address)` instead.

Does not give accurate balances. Provided for completeness / compatibility only.

## dashsight.getInstantBalance(addr)

Takes a normal payment address, gives back the instantaneous balance (reflects
instant send TXs).

```js
// Base58Check-encoded Pay to Pubkey Hash (p2pkh)
let addr = `Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`;

let info = await dashsight.getInstantBalance(addr);

console.log(info);
```

Example output:

```json
{
  "addrStr": "Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "balance": 10.01,
  "balanceSat": 1001000000
}
```

Note: This is not actually part of Dash's Insight API, but would be if it could
correctly calculate balances adjusted for Instant Send.

## dashsight.getTx(txIdHex)

Get transaction details by its (hex-encoded) ID.

```js
// Base58Check-encoded Pay to Pubkey Hash (p2pkh)
let txid = `f92e66edc9c8da41de71073ef08d62c56f8752a3f4e29ced6c515e0b1c074a38`;

let tx = await dashsight.getTx(txid);

console.log(tx);
```

Example output:

```json
{
  "txid": "f92e66edc9c8da41de71073ef08d62c56f8752a3f4e29ced6c515e0b1c074a38",
  "version": 2,
  "locktime": 1699123,
  "vin": [
    {
      "txid": "346035a9ab38c84eb13964aff45e7a4d363f467fb755be0ffac6dfb2f80f63dc",
      "vout": 1,
      "sequence": 4294967294,
      "n": 0,
      "scriptSig": {
        "hex": "483045022100f8f5feb0a533f8509cb6cbb0b046dc1136adaab378e9a5151dc4fe633dd064710220157b08ddf7557b5e69c6128989a7da7fccadd28836f0fb99860d730f4320681a0121038c681a93929bb4fe5d39025d42f711abab49a247f8312943d3021c6eb3231c82",
        "asm": "3045022100f8f5feb0a533f8509cb6cbb0b046dc1136adaab378e9a5151dc4fe633dd064710220157b08ddf7557b5e69c6128989a7da7fccadd28836f0fb99860d730f4320681a[ALL] 038c681a93929bb4fe5d39025d42f711abab49a247f8312943d3021c6eb3231c82"
      },
      "addr": "Xhn6eTCwW94vhVifhshyTeihvTa7LcatiM",
      "valueSat": 100001,
      "value": 0.00100001,
      "doubleSpentTxID": null
    }
  ],
  "vout": [
    {
      "value": "0.00099809",
      "n": 0,
      "scriptPubKey": {
        "hex": "76a91473640d816ff4161d8c881da78983903bf9eba2d988ac",
        "asm": "OP_DUP OP_HASH160 73640d816ff4161d8c881da78983903bf9eba2d9 OP_EQUALVERIFY OP_CHECKSIG",
        "addresses": ["XmCyQ6qARLWXap74QubFMunngoiiA1QgCL"],
        "type": "pubkeyhash"
      },
      "spentTxId": null,
      "spentIndex": null,
      "spentHeight": null
    }
  ],
  "blockheight": -1,
  "confirmations": 0,
  "time": 1657004174,
  "valueOut": 0.00099809,
  "size": 192,
  "valueIn": 0.00100001,
  "fees": 0.00000192,
  "txlock": true
}
```

Note: newly minted coins (block rewards) have a different format than payment
transactions. See the example at:

- [./examples/block-reward-from-coinbase.tx.json](/examples/block-reward-from-coinbase.tx.json)

## dashsight.getTxs(addrStr)

Get all transaction associated with an address.

```js
// Base58Check-encoded Pay to Pubkey Hash (p2pkh)
let addr = `Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`;

let txs = await dashsight.getTxs(addr);

console.log(txs);
```

Example output:

(same as above for `getTx(txid)`)

## dashsight.getUtxos(addrStr)

Gets all unspent transaction outputs (the usable "coins") for the given address.

**Do not use**. Use `dashsight.getCoreUtxos(address)` instead.

This does not include `outputIndex`, which is necessary to create a transaction
for use with `dashsight. instantSend(txHex)`.

Provided for completeness / compatibility only.

```js
// Base58Check-encoded Pay to Pubkey Hash (p2pkh)
let addr = `Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`;

let utxos = await dashsight.getUtxos(addr);

console.log(utxos);
```

```json
[
  {
    "address": "Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "txid": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "vout": 0,
    "scriptPubKey": "00000000000000000000000000000000000000000000000000",
    "amount": 0.01,
    "satoshis": 1000000,
    "height": 1500000,
    "confirmations": 200000
  }
]
```

## dashsight.getCoreUtxos(addrStr)

Gets all unspent transaction outputs (the usable "coins") for the given address,
including all information needed by `DashTx#hashAndSignAll()` (and
`dashcore-lib.Transaction`).

```js
// Base58Check-encoded Pay to Pubkey Hash (p2pkh)
let addr = `Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`;

let utxos = await dashsight.getCoreUtxos(addr);

console.log(utxos);
```

Example output:

```json
[
  {
    "address": "XmCyQ6qARLWXap74QubFMunngoiiA1QgCL",
    "outputIndex": 0,
    "satoshis": 99809,
    "script": "76a91473640d816ff4161d8c881da78983903bf9eba2d988ac",
    "txId": "f92e66edc9c8da41de71073ef08d62c56f8752a3f4e29ced6c515e0b1c074a38"
  }
]
```

## dashsight.instantSend(txHex)

Send a _signed transaction_ to Dash's Insight API for relay and broadcast to the
Dash network.

```js
let txHex = 'xxxxxxxx...';

let result = await dashsight.instantSend(txHex);

console.log(result);
```

Example transaction hex (input): \
(inspect at <https://live.blockcypher.com/dash/decodetx/>)

```text
030000000187ab81e88e2c19ca354f33f14d5b43b60d171ac851eb97dddd271b510cadbdb0000000
006b483045022100ec38c77b9f285d4c9aeeba36c1fac51bb88f7443185caf7eec21b170cc5d4062
0220098dcb5d90cb5f4ddc75ef54e2b2d1dbf220eb6fc28eed61c43192c0a420802c012103a6da86
f51829979a3c9f05251d9400d153111655526c6c25f8f82aba38b8a745ffffffff01188501000000
00001976a9149a00c2072c0209688cc6de5cc557af03e4f41b6388ac00000000
```

Example output:

```json
{ "txid": "0f90cf5e03e8b8f8c4468f60fc8328cfcd5617fc2163f485fabfd227c692bf93" }
```

Guides & Code Examples for creating and signing `txHex`:

- [How to create a txHex with DashTx + DashKeys](https://github.com/dashhive/DashSight.js/issues/27)
- [Balance Transfer + DashSight: ./examples/balance-transfer.js](/examples/balance-transfer.js).
- [Multi-Payout + DashSight: ./examples/multi-send.js](/examples/multi-send.js).
