module.exports.config = {
  name: "supportgc",
  version: "1.0.5",
  hasPermssion: 0, // সবাই ব্যবহার করতে পারবে
  credits: "Rasel Mahmud",
  description: "Check or join support group",
  commandCategory: "For users",
  usages: "[supportgc]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  try {
    const groupID = "24272104642409078"; // Support group ID
    const threadInfo = await api.getThreadInfo(groupID);
    const botID = api.getCurrentUserID();

    if (threadInfo.participantIDs.includes(botID)) {
      // Already in the group
      await api.sendMessage("✅ Already in the support group! 💬", event.threadID);
    } else {
      // Try to join the group
      try {
        await api.joinGroup(groupID);
        // Successfully joined
        await api.sendMessage("✅ Successfully joined the support group! 🎉", event.threadID);
      } catch {
        // Request pending (if bot cannot join directly)
        await api.sendMessage("⏳ Request pending with admins 🤝", event.threadID);
      }
    }
  } catch (err) {
    console.error(err);
    await api.sendMessage(
      "❌ Error! Send me a friend request and try again later ⚠️",
      event.threadID
    );
  }
};
