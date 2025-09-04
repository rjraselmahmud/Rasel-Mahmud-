const axios = require('axios');
const fs = require('fs-extra');
const { join } = require('path');

module.exports.config = {
  name: "raselvideo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Send video from predefined Drive links",
  commandCategory: "Media",
  usages: "[raselvideo]",
  cooldowns: 5
};

// Add multiple Drive links here
const videoLinks = [
  "https://drive.google.com/uc?export=download&id=120VWJYb1xOHgvlkGdrsMneM6-ewKvvpe"
];

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!args[0] || !["raselvideo", "Raselvideo"].includes(args[0])) return;

    const threadID = event.threadID;
    const messageID = event.messageID;

    // Pick the first video (or you can randomize)
    const videoURL = videoLinks[0];

    // Download video to temp folder
    const videoPath = join(__dirname, `cache/raselvideo_${Date.now()}.mp4`);
    const response = await axios({ url: videoURL, method: "GET", responseType: "stream" });
    response.data.pipe(fs.createWriteStream(videoPath));

    response.data.on("end", async () => {
      const body = `🎬 𝐇𝐞𝐫𝐞'𝐬 𝐘𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨!\n🎙️ 𝐕𝐨𝐢𝐜𝐞 𝐨𝐟 𝐑𝐚𝐬𝐞𝐥 𝐌𝐚𝐡𝐦𝐮𝐝\n📽️`;
      await api.sendMessage(
        { body, attachment: fs.createReadStream(videoPath) },
        threadID,
        () => fs.unlinkSync(videoPath),
        messageID
      );
    });

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ Failed to send the video. Please try again later.", event.threadID, event.messageID);
  }
};
