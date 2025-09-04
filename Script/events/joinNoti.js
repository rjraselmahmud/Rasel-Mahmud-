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

  // Required folders
  const pathJoinGif = join(__dirname, "cache", "joinGif", "randomgif");
  if (!existsSync(pathJoinGif)) mkdirSync(pathJoinGif, { recursive: true });
};

module.exports.run = async function ({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { createReadStream, existsSync } = global.nodemodule["fs-extra"];
  const threadID = event.threadID;

  try {
    // Fixed video path
    const fixedVideoForBot = join(__dirname, "cache", "joinGif", "randomgif", "Pinterest di 2025(MP4).mp4");

    // Case 1: Bot itself added
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
      // Update bot nickname
      await api.changeNickname(
        `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || " "}`,
        threadID,
        api.getCurrentUserID()
      );

      const botWelcomeBody = `✨💙 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄 𝙰𝙻𝙰𝙸𝙺𝚄𝙼 💙✨
🌸 Grateful to join this amazing group! 🩷
💫 I will do my best to share positivity, In Sha Allah ✨
📌 Command: ${global.config.PREFIX}help
🤖 BOT NAME: ${global.config.BOTNAME || "HeIi•LUMO 💎✨"}`;

      if (existsSync(fixedVideoForBot)) {
        return api.sendMessage({ body: botWelcomeBody, attachment: createReadStream(fixedVideoForBot) }, threadID);
      } else {
        return api.sendMessage({ body: botWelcomeBody }, threadID);
      }
    }

    // Case 2: Normal member(s) added → ONLY TEXT
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let participant of event.logMessageData.addedParticipants) {
      const userName = participant.fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id: participant.userFbId });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    const msg = `✨💙❖💙✨
🖤 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄 𝙰𝙻𝙰𝙸𝙺𝚄𝙼 ${nameArray.join(', ')} 🖤
WELCOME TO 💖 ${threadName} 💖
━━━━━━━━━━━━━━
🌸 You are our ✨ ${memLength.join(', ')}ᵗʰ ✨ member!
🥰 Hope you enjoy your time here!
━━━━━━━━━━━━━━
👤 Added By: ${event.author || "Group Admin"}
📌 Command: ${global.config.PREFIX}help
~ BY: ${global.config.BOTNAME || "HeIi•LUMO 💎✨"}`;

    return api.sendMessage({ body: msg, mentions }, threadID);

  } catch (e) {
    console.log(e);
  }
};
