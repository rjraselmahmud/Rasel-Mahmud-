const fs = require("fs");

module.exports.config = {
  name: "Prefix",
  version: "1.1.3",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Check bot prefix (works with or without prefix) + send video",
  commandCategory: "system",
  usages: "[Prefix]",
  cooldowns: 0
};

const filePath = "Script/commands/cache/Messenger_creation_735562086110495.mp4";

// প্রিফিক্স ছাড়া কাজ করানোর জন্য
module.exports.handleEvent = async function ({ api, event, Threads }) {
  const { body, threadID } = event;
  if (!body) return;

  if (body.toLowerCase().trim() === "prefix") {
    const data = await Threads.getData(threadID);
    const systemPrefix = global.config.PREFIX;
    const boxPrefix = data.PREFIX || systemPrefix;

    return api.sendMessage(
      {
        body: `🌐 System prefix: ${systemPrefix}\n🛸 Your box chat prefix: ${boxPrefix}`,
        attachment: fs.createReadStream(filePath)
      },
      threadID
    );
  }
};

// প্রিফিক্স দিয়ে কাজ করানোর জন্য
module.exports.run = async function ({ api, event, Threads }) {
  const { threadID } = event;
  const data = await Threads.getData(threadID);
  const systemPrefix = global.config.PREFIX;
  const boxPrefix = data.PREFIX || systemPrefix;

  return api.sendMessage(
    {
      body: `🌐 System prefix: ${systemPrefix}\n🛸 Your box chat prefix: ${boxPrefix}`,
      attachment: fs.createReadStream(filePath)
    },
    threadID
  );
};
