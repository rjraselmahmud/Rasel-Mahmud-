module.exports.config = {
  name: "supportgc",
  version: "1.1.2",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Add user to support group safely",
  commandCategory: "System",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const supportGroupID = "24272104642409078"; // গ্রুপের threadID
  const userID = event.senderID;
  const threadID = event.threadID;

  try {
    // Friend check (যদি ইউজার আগে বটের সাথে কন্টাক্ট না করে)
    const userInfo = await api.getUserInfo(userID);
    if (!userInfo || !userInfo[userID]) {
      return api.sendMessage(
        "✉️ প্রথমে আমাকে ফ্রেন্ড রিকোয়েস্ট পাঠাও বা ইনবক্সে মেসেজ করো।",
        threadID,
        event.messageID
      );
    }

    // গ্রুপের তথ্য নাও
    const supportInfo = await api.getThreadInfo(supportGroupID);
    const botID = api.getCurrentUserID();

    // Bot যদি admin থাকে → সরাসরি add
    if (supportInfo.adminIDs.some(admin => admin.id == botID)) {
      await api.addUserToGroup(userID, supportGroupID);
      return api.sendMessage(
        "✅ আপনাকে support গ্রুপে অ্যাড করা হলো 🎉",
        threadID,
        event.messageID
      );
    } 
    else {
      // Bot admin না হলে → request message
      return api.sendMessage(
        "🕓 আপনার রিকোয়েস্ট support গ্রুপে যোগ করার জন্য সংরক্ষণ করা হলো।",
        threadID,
        event.messageID
      );
    }

  } catch (err) {
    console.error(err);
    return api.sendMessage(
      "❌ কিছু একটা সমস্যা হয়েছে, পরে আবার চেষ্টা করো।",
      threadID,
      event.messageID
    );
  }
};
