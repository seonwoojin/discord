const WebSocket = require("ws");
const os = require("os");
const io = require("socket.io-client");
require("dotenv").config();
const channelData = [
  "933535214645444628/1075569560222191657",
  "933535214645444628/933536415411748925",
  "933535214645444628/998951698200547348",
  "893309380815118336/909579416642912276",
  "932620732603703356/933268601039896626",
  "938836025659232327/940359293302108211",
  "990785690579128340/1001376242714554378",
  "964450253149454356/967894873682366475",
  "964450253149454356/971790342225526814",
  "935064183244988446/935367823524524082",
  "951321338671423598/951321338965032977",
  "686661995121868830/828346862993014834",
  "686661995121868830/941035252195946526",
  "870127360127696896/947534727060021269",
  "961114489414094898/961119507500372038",
  "961114489414094898/961118504180924426",
  "1083750617664725032/1083750618503589950",
  "990785690579128340/1113017925872386048",
];

//OPcode
const OpCodes = {
  Dispatch: 0,
  Heartbeat: 1,
  Identify: 2,
  PresenceUpdate: 3,
  VoiceStateUpdate: 4,
  Resume: 6,
  Reconnect: 7,
  RequestGuildMembers: 8,
  InvalidSession: 9,
  Hello: 10,
  HeartbeatAck: 11,
};

let resume_gateway_url = "";
let session_id = "";
let seq = 0;
let heartbeatInterval = null;

// 웹소켓 통신
const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
console.log(process.env.GATEWAY);
const bluetagsWs = io(process.env.GATEWAY, {
  withCredentials: true,
});
let interval = 0;
let token =
  "Mzg5NjU1MDAxOTgwNDY5MjQ5.GIGt-U.zoMkmzv3FbyoGfGl7RcIi2UAtqxv3juzQW2jRg";

bluetagsWs.on("connect", () => {});

// 전체 함수
function connectWs() {
  // 상수
  const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
  let payload = {
    op: 2,
    d: {
      token: token,
      properties: {
        $os: process.platform,
        $browser: "node.js",
        $device: os.type(),
      },
    },
  };

  // 웹소켓 오픈
  ws.on("open", function open() {
    console.log("hello");
    ws.send(JSON.stringify(payload));
  });
  // 웹소켓 통신
  ws.on("message", function incoming(data) {
    let payload = JSON.parse(data);

    // 통신 결과
    const { t, event, op, d } = payload;
    console.log("op code is : ", op);
    console.log("t is :", t);
    console.log("event is :", event);
    console.log("=".repeat(50));

    switch (op) {
      case 10:
        const { heartbeat_interval } = d;
        interval = heartbeat(heartbeat_interval);
        break;

      case 7:
        console.log("Reconnect");
        break;
    }
    switch (t) {
      case "MESSAGE_CREATE":
        const id = d.guild_id + "/" + d.channel_id;
        if (channelData.includes(id)) {
          console.log(d);
          bluetagsWs.emit("create discord post", d);
        }
        // if (d.attachments.length > 0) {
        // }
        break;
      case "MESSAGE_UPDATE":
        console.log(`MESSAGE_UPDATE ${d}`);
    }
  });
  // 웹소켓 자체가 통신이 끊어졌을 때 재연결
  ws.onclose = (e) => {
    console.log("Socket is closed.");
    connectWs();
  };
}
// 디스코드 heartbeat
const heartbeat = (ms) => {
  return setInterval(() => {
    ws.send(JSON.stringify({ op: 1, d: null }));
  }, ms);
};

connectWs();
