const axios = require("axios");
const path = require("path");
const fs = require("fs");

const BASE_API_URL = "https://album-api-1ez5.onrender.com";

module.exports.config = {
  name: "album",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Premium Album: Videos & Photos",
  usePrefix: true,
  prefix: true,
  category: "Media",
  commandCategory: "Media",
  usages: "/album or /album [category]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const albumOptionsPage1 = [
    "funny", "islamic", "sad", "anime", "cartoon",
    "love", "horny", "couple", "flower", "marvel"
  ];
  const albumOptionsPage2 = [
    "aesthetic", "sigma", "lyrics", "cat", "18plus",
    "freefire", "football", "girl", "friend", "cricket"
  ];

  const toBold = (text) => text.replace(/[a-z]/g, (c) => String.fromCodePoint(0x1d41a + c.charCodeAt(0) - 97));
  const toBoldNumber = (num) => String(num).replace(/[0-9]/g, (c) => String.fromCodePoint(0x1d7ec + parseInt(c)));
  const formatOptions = (options, startIndex = 1) =>
    options.map((opt, i) => `✨ | ${toBoldNumber(i + startIndex)}. ${toBold(opt)}`).join("\n");

  if (args[0] === "2") {
    const message2 =
      "💫 Choose your Album 💫\n" +
      "✺━━━━━━━◈◉◈━━━━━━━✺\n" +
      formatOptions(albumOptionsPage2, 11) +
      "\n✺━━━━━━━◈◉◈━━━━━━━✺\n🎯 | Page [2/2]\n✺━━━━━━━◈◉◈━━━━━━━✺";

    return api.sendMessage({ body: message2 }, threadID, (error, info) => {
      if (!error) {
        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: senderID,
          link: albumOptionsPage2,
        });
      }
    }, messageID);
  }

  if (!args[0] || args[0].toLowerCase() === "list") {
    const message =
      "💫 Choose your Album 💫\n" +
      "✺━━━━━━━◈◉◈━━━━━━━✺\n" +
      formatOptions(albumOptionsPage1) +
      `\n✺━━━━━━━◈◉◈━━━━━━━✺\n🎯 | Page [1/2]\nℹ | Type: ${global.config.PREFIX}album 2 → Next Page\n✺━━━━━━━◈◉◈━━━━━━━✺`;

    return api.sendMessage({ body: message }, threadID, (error, info) => {
      if (!error) {
        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: senderID,
          link: albumOptionsPage1,
        });
      }
    }, messageID);
  }

  return api.sendMessage("❌ Invalid category! Type /album to view list.", threadID, messageID);
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  api.unsendMessage(handleReply.messageID);

  const replyNum = parseInt(event.body);
  if (isNaN(replyNum)) {
    return api.sendMessage("❌ Reply with a number only!", event.threadID, event.messageID);
  }

  const categories = [
    "funny", "islamic", "sad", "anime", "cartoon",
    "love", "horny", "couple", "flower", "marvel",
    "aesthetic", "sigma", "lyrics", "cat", "18plus",
    "freefire", "football", "girl", "friend", "cricket"
  ];

  if (replyNum < 1 || replyNum > categories.length) {
    return api.sendMessage("⚠️ Wrong number! Try again.", event.threadID, event.messageID);
  }

  const selectedCategory = categories[replyNum - 1];

  const adminIDs = ["61571550050635", "100024220812646"];
  if ((selectedCategory === "horny" || selectedCategory === "18plus") && !adminIDs.includes(event.senderID)) {
    return api.sendMessage("🚫 You’re not allowed for this category.", event.threadID, event.messageID);
  }

  const captions = {
    funny: "🤣 Funny drop incoming!",
    islamic: "🕌 Islamic vibe!",
    sad: "😢 Sad vibes!",
    anime: "🎌 Anime scene!",
    cartoon: "🎨 Cartoon clip!",
    love: "❤️ Love drop!",
    horny: "🥵 Hot drop!",
    couple: "💞 Couple vibes!",
    flower: "🌸 Bloom drop!",
    marvel: "🦸 Marvel clip!",
    aesthetic: "🎀 Aesthetic vibe!",
    sigma: "🐺 Sigma mood!",
    lyrics: "🎶 Lyrics drop!",
    cat: "🐱 Cat vibe!",
    "18plus": "🔞 18+ drop!",
    freefire: "🎮 Freefire clip!",
    football: "⚽ Football vibe!",
    girl: "👧 Girl vibe!",
    friend: "👫 Friendship drop!",
    cricket: "🏏 Cricket clip!"
  };

  try {
    const res = await axios.get(`${BASE_API_URL}/album?type=${selectedCategory}`);
    console.log("API Response:", res.data);

    const mediaUrl = res.data.data;
    if (!mediaUrl) {
      return api.sendMessage("⚠️ No content found!", event.threadID, event.messageID);
    }

    console.log("Media URL:", mediaUrl);

    const response = await axios({ method: "get", url: mediaUrl, responseType: "stream" });
    const filename = path.basename(mediaUrl).split("?")[0];
    const filePath = path.join(__dirname, "cache", `${Date.now()}_${filename}`);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: captions[selectedCategory] || `🎬 ${selectedCategory} drop!`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    });

    writer.on("error", (err) => {
      console.error("Write Error:", err);
      api.sendMessage("❌ Failed to send video!", event.threadID, event.messageID);
    });

  } catch (err) {
    console.error("Axios Error:", err);
    return api.sendMessage(`❌ Server error: ${err.message}`, event.threadID, event.messageID);
  }
};
