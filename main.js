const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });
const CHANNEL_ID = "1083750618503589950"; // 가져올 채널의 ID

client.once("ready", () => {
  console.log("봇이 준비되었습니다.");
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (!channel) {
    console.log(`채널을 찾을 수 없습니다: ${CHANNEL_ID}`);
    return;
  }
  channel
    .fetch()
    .then((channel) => console.log(channel))
    .catch(console.error);
});

client.login(
  "MTA4MzcyMTQyNDEwMDkzNzgyOQ.GV6PMq.2Uqs7AUHwmdUx0_FYL0MEEf9CNcjAMx3dda4Ss"
);
