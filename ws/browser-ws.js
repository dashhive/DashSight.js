'use strict';

let now;

now = Date.now();
let newWsUrl = `https://insight.dash.org/socket.io/?EIO=3&transport=polling&t=${now}`;
let connectResp = await fetch(newWsUrl, {});
let msg = await connectResp.text();

let colonIndex = msg.indexOf(":");
// 0 is CONNECT, which will always follow our first message
let start = colonIndex + ":0".length;
let len = parseInt(msg.slice(0, colonIndex), 10);
let json = msg.slice(start, start + (len - 1));
let session = JSON.parse(json);
console.log(session);

now = Date.now();
let sid = session.sid;
let ws = new WebSocket(
  `wss://insight.dash.org/socket.io/?EIO=3&transport=websocket&t=${now}&sid=${sid}`,
);

ws.onopen = function (msg) {
  console.log("open", msg);
  ws.send("2probe");
};

function setPing() {
  console.log("schedule ping");
  setTimeout(function () {
    ws.send("2");
  }, session.pingInterval - 2000);
}

ws.onmessage = function (ev) {
  console.log("message", ev.data);
  if ("3probe" === ev.data) {
    ws.send("5");
    setPing();
    return;
  }

  if ("3" === ev.data) {
    setPing();
    return;
  }
};

now = Date.now();
let subUrl = `https://insight.dash.org/socket.io/?EIO=3&transport=polling&t=${now}&sid=${sid}`;
let subResp = await fetch(subUrl, {
  method: 'POST',
  body: `21:42["subscribe","inv"]`,
});
let msg2 = await subResp.text();
console.log(msg2);

//

//ws.close();

