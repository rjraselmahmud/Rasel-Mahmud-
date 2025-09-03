module.exports.config = {
  name: "prefix",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Check bot prefix (works with or without prefix)",
  commandCategory: "system",
  usages: "[prefix]",
  cooldowns: 0
};

// প্রিফিক্স ছাড়া কাজ করানোর জন্য
module.exports.handleEvent = async function ({ api, event, Threads }) {
  const { body, threadID } = event;
  if (!body) return;

  if (body.toLowerCase().trim() === "prefix") {
    const data = await Threads.getData(threadID);
    const systemPrefix = global.config.PREFIX;
    const boxPrefix = data.PREFIX || systemPrefix;

    return api.sendMessage(
      `🌐 System prefix: ${systemPrefix}\n🛸 Your box chat prefix: ${boxPrefix}`,
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
    `🌐 System prefix: ${systemPrefix}\n🛸 Your box chat prefix: ${boxPrefix}`,
    threadID
  );
};
