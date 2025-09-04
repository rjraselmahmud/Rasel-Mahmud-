module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.5",
  credits: "Rasel Mahmud",
  description: "Notification of bots or people entering groups",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const pathJoinGif = join(__dirname, "cache", "joinGif", "randomgif");
  if (!existsSync(pathJoinGif)) mkdirSync(pathJoinGif, { recursive: true });
};

module.exports.run = async function ({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { createReadStream, existsSync } = global.nodemodule["fs-extra"];
  const threadID = event.threadID;

  try {
    const fixedVideoForBot = join(__dirname, "cache", "joinGif", "randomgif", "Pinterest di 2025(MP4).mp4");

    // Case 1: Bot itself added
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
      await api.changeNickname(
        `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || " "}`,
        threadID,
        api.getCurrentUserID()
      );

      const botWelcomeBody = `✨💙 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄 𝙰𝙻𝙰𝙸𝙺𝚄𝙼 💙✨
🌸 Grateful to join this amazing group! 🩷
💫 I will do my best to share positivity, In Sha Allah ✨
📌 Command: ${global.config.PREFIX}help
𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: 𝐇𝐞𝐈𝐢•𝗟𝗨𝗠𝗨 💎✨`;

      if (existsSync(fixedVideoForBot)) {
        return api.sendMessage({ body: botWelcomeBody, attachment: createReadStream(fixedVideoForBot) }, threadID);
      } else {
        return api.sendMessage(botWelcomeBody, threadID);
      }
    }

    // Case 2: Normal member(s) added
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id: event.logMessageData.addedParticipants[id].userFbId });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    // Get author name (who added)
    let authorID = event.author || "";
    let authorName = "Admin";
    if (authorID) {
      try {
        let userInfo = await api.getUserInfo(authorID);
        authorName = userInfo[authorID].name || "Admin";
      } catch (e) {
        authorName = "Admin";
      }
    }

    const msg = `✨💙❖💙✨
🖤 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄𝙰𝙻𝙰𝙸𝙺𝚄𝙼 ✨ ${nameArray.join(', ')} ✨
WELCOME TO 💖 ${threadName} 💖
❖💛❖
🌸 You are our ✨ ${memLength.join(', ')}ᵗʰ ✨ member!
🥰 Hope you enjoy your time here!
💬 Have a great & positive day! ✨
❖💙❖
👤 Added By: ${authorName}  
💎━━━━━━━━━━━━━━💎
~ BY: 𝐇𝐞𝐈𝐢•𝗟𝗨𝗠𝗨 💎✨
📌 Command: ${global.config.PREFIX}help`;

    return api.sendMessage({ body: msg, mentions }, threadID);

  } catch (e) {
    console.log(e);
  }
};
