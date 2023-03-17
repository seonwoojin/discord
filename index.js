const WebSocket = require("ws");
const os = require("os");
const { default: axios } = require("axios");

const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
let interval = 0;

let token =
  "Mzg5NjU1MDAxOTgwNDY5MjQ5.GF6UGX.h9cDQRCxEftNY8nxk8PWeUMHBhO8tmYP58xsUs";
let payload = {
  op: 2,
  d: {
    token: token,
    //intents: 513,
    properties: {
      $os: process.platform,
      $browser: "node.js",
      $device: os.type(),
    },
  },
};

ws.on("open", function open() {
  ws.send(JSON.stringify(payload));
  console.log("start");
});

ws.on("message", async function incoming(data) {
  let payload = JSON.parse(data);
  const { t, event, op, d } = payload;
  switch (op) {
    case 10:
      const { heartbeat_interval } = d;
      interval = heartbeat(heartbeat_interval);
      break;
  }
  if (
    d.guild_id === "938836025659232327" &&
    (d.channel_id === "940359293302108211" ||
      d.channel_id === "1062253413854871573" ||
      d.channel_id === "1072410249451020319")
  ) {
    console.log(t);
    console.log(`MESSAGE_CREATE`, JSON.stringify(d));
    await axios.post("https://www.bluetags.app/api/admin/create-rawData", {
      data: JSON.stringify(d),
    });
  }
});

const heartbeat = (ms) => {
  return setInterval(() => {
    ws.send(JSON.stringify({ op: 1, d: null }));
  }, ms);
};
