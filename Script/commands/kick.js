module.exports.config = {
  name: "kick",
  version: "1.0.4",
  hasPermssion: 1,
  credits: "Rasel Mahmud",
  description: "Kick member by tag or reply",
  commandCategory: "System",
  usages: "[tag/reply]",
  cooldowns: 0,
};

module.exports.run = async function({ api, event }) {
  try {
    const { threadID, messageReply, mentions } = event;

    // কে কে কিক হবে?
    let targets = [];

    if (mentions && Object.keys(mentions).length > 0) {
      targets = Object.keys(mentions);
    } else if (messageReply && messageReply.senderID) {
      targets.push(messageReply.senderID);
    }

    if (targets.length === 0) {
      return api.sendMessage("❌ Please tag or reply to someone to kick.", threadID, event.messageID);
    }

    // থ্রেড ইনফো আনা
    const threadInfo = await api.getThreadInfo(threadID);

    // বট এডমিন কিনা চেক
    if (!threadInfo.adminIDs.some(item => item.id == api.getCurrentUserID())) {
      return api.sendMessage("❌ I need to be an admin to kick members!", threadID, event.messageID);
    }

    // এডমিনদের বাদ দিয়ে টার্গেট ফিল্টার করা
    targets = targets.filter(uid => !threadInfo.adminIDs.some(item => item.id == uid));
    if (targets.length === 0) {
      return api.sendMessage("⚠️ Cannot kick group admins.", threadID, event.messageID);
    }

    // সাইলেন্ট কিক (কোনো success SMS দিবে না)
    for (const uid of targets) {
      await api.removeUserFromGroup(uid, threadID);
    }

  } catch (err) {
    console.error("KICK ERROR:", err);
    return api.sendMessage("❌ Error while trying to kick.", event.threadID, event.messageID);
  }
};
