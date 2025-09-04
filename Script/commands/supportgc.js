module.exports.config = {
  name: "supportgc",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Add users to support group (Mirai Bot compatible)",
  commandCategory: "system",
  usages: "[supportgc]",
  cooldowns: 0,
};

module.exports.run = async function({ api, event }) {
  try {
    const supportGroupID = "24272104642409078"; // Mirai group ID as string
    const senderID = event.sender.id;

    // 1️⃣ Check if user is already in the support group
    const groupInfo = await api.getGroup({ groupId: supportGroupID });
    const participantIDs = groupInfo.members.map(m => m.id);

    if (participantIDs.includes(senderID)) {
      return api.sendMessage({
        groupId: event.group.id,
        message: "✅ You are already in the support group."
      });
    }

    // 2️⃣ Try to add user
    try {
      await api.addMember({
        groupId: supportGroupID,
        memberId: senderID
      });

      return api.sendMessage({
        groupId: event.group.id,
        message: "🎉 You have been added to the support group!"
      });

    } catch (err) {
      // 3️⃣ If add fails (non-admin or privacy)
      return api.sendMessage({
        groupId: event.group.id,
        message: "🕓 Your request to join the support group is pending. Please ensure you are friends with the bot."
      });
    }

  } catch (e) {
    console.error(e);
    return api.sendMessage({
      groupId: event.group.id,
      message: "❌ Something went wrong. Please try again later."
    });
  }
};
