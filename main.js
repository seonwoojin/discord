const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [513],
});
const CHANNEL_ID = "940359293302108211"; // 가져올 채널의 ID
require("dotenv").config();
client.once("ready", async () => {
  console.log("봇이 준비되었습니다.");
  const channel = await client.channels.fetch(CHANNEL_ID);
  console.log(channel);
  // if (!channel) {
  //   console.log(`채널을 찾을 수 없습니다: ${CHANNEL_ID}`);
  //   return;
  // }
  // channel
  //   .fetch()
  //   .then((channel) => console.log(channel))
  //   .catch(console.error);
});

client.login(process.env.TOKEN);
