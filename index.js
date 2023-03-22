const WebSocket = require("ws");
const os = require("os");
const { default: axios } = require("axios");
require("dotenv").config();

const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
let interval = 0;

let token = process.env.API;
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
  console.log(t);
  if (d?.guild_id && d?.channel_id) {
    console.log(d?.guild_id);
    if (
      d.guild_id === "938836025659232327" &&
      (d.channel_id === "940359293302108211" ||
        d.channel_id === "1062253413854871573" ||
        d.channel_id === "1072410249451020319")
    ) {
      console.log(t, JSON.stringify(d));
      await axios.post("https://www.bluetags.app/api/admin/create-rawData", {
        data: JSON.stringify(d),
      });
    }
  }
});

const heartbeat = (ms) => {
  return setInterval(() => {
    ws.send(JSON.stringify({ op: 1, d: null }));
  }, ms);
};
