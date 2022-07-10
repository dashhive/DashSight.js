#!/usr/bin/env node
"use strict";

/**
 * @overview Broadcast raw tx hex to the network via the Dash's Insight API
 */

require("dotenv").config({ path: ".env" });

let dashsightBaseUrl =
  process.env.INSIGHT_BASE_URL || "https://insight.dash.org";

let Dashsight = require("../");

let dashsight = Dashsight.create({
  baseUrl: dashsightBaseUrl,
});

async function main() {
  let json = removeItem(process.argv, "--json");
  let txHex = process.argv[2];

  if (!txHex) {
    console.error(`Usage: balance <address> [address,...]`);
    process.exit(1);
    return;
  }

  let result = await dashsight.instantSend(txHex);
  if (json) {
    console.info(JSON.stringify(result.body, null, 2));
    return;
  }

  console.info("Transaction ID:");
  console.info(result.body.txid);
  console.info();
  console.info(
    "Inspect transaction hex at https://live.blockcypher.com/dash/decodetx/",
  );
  console.info("Inspect transaction by txid at https://insight.dash.org/");
  console.info();
}

/**
 * @param {Array<any>} arr
 * @param {any} item
 */
function removeItem(arr, item) {
  let index = arr.indexOf(item);
  if (index >= 0) {
    return arr.splice(index, 1)[0];
  }
  return null;
}

main()
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
