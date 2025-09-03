module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Rasel Mahmud",
  description: "Notification of bots or people entering groups with fixed gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  // ensure required folders exist
  const pathJoinVideo = join(__dirname, "cache", "joinvideo");
  if (!existsSync(pathJoinVideo)) mkdirSync(pathJoinVideo, { recursive: true });
  const pathRandom = join(__dirname, "cache", "joinvideo", "randomgif");
  if (!existsSync(pathRandom)) mkdirSync(pathRandom, { recursive: true });
  const pathJoinGif = join(__dirname, "cache", "joinGif");
  if (!existsSync(pathJoinGif)) mkdirSync(pathJoinGif, { recursive: true });
};

module.exports.run = async function ({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
  const { threadID } = event;

  try {
    // fixed video to send WHEN BOT is added to a new group
    const fixedVideoForBot = join(__dirname, "cache", "joinGif", "Pinterest di 2025(MP4).mp4");

    // if the bot itself was added to the group
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
      // change nickname (same as before)
      await api.changeNickname(
        `[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`,
        threadID,
        api.getCurrentUserID()
      );

      // welcome text when bot is added
      const botWelcomeBody = `✨💙 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄 𝙰𝙻𝙰𝙸𝙺𝚄𝙼 💙✨  
🌸 𝙂𝚛𝚊𝚝𝚎𝚏𝚞𝚕 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚒𝚜 𝚊𝚖𝚊𝚣𝚒𝚗𝚐 𝚐𝚛𝚘𝚞𝚙! 🩷  
💫 𝙸 𝚠𝚒𝚕𝚕 𝚍𝚘 𝚖𝚢 𝚋𝚎𝚜𝚝 𝚝𝚘 𝚜𝚑𝚊𝚛𝚎 𝚙𝚘𝚜𝚒𝚝𝚒𝚟𝚒𝚝𝚢, 𝙸𝚗 𝚂𝚑𝚊 𝙰𝚕𝚕𝚊𝚑 ✨  
📌 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜: ${global.config.PREFIX}help | ${global.config.PREFIX}menu
𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: 𝐇𝐞𝐈𝐢•𝗟𝗨𝗠𝗢 💎✨`;

      // send fixed video if exists, otherwise send only text
      if (existsSync(fixedVideoForBot)) {
        return api.sendMessage({ body: botWelcomeBody, attachment: createReadStream(fixedVideoForBot) }, threadID);
      } else {
        return api.sendMessage({ body: botWelcomeBody }, threadID);
      }
    }

    // ----- else: normal member(s) added -----
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    const pathJoinVideo = join(__dirname, "cache", "joinvideo");
    if (!existsSync(pathJoinVideo)) mkdirSync(pathJoinVideo, { recursive: true });

    // thread-specific video path (if you use per-thread video files)
    const pathGif = join(pathJoinVideo, `${threadID}.video`);
    // random folder for fallback for normal joins
    const randomList = readdirSync(join(__dirname, "cache", "joinvideo", "randomgif"));

    // prepare mentions & names
    var mentions = [], nameArray = [], memLength = [], i = 0;
    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id: event.logMessageData.addedParticipants[id].userFbId });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    // message (use custom if set)
    let msg = threadData.customJoin || `✨💙❖💙✨
🖤 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄𝙰𝙻𝙰𝙸𝙺𝚄𝙼 ✨ {name} ✨
WELCOME TO 💖 {threadName} 💖
❖💛❖
🌸 You are our ✨ {soThanhVien}ᵗʰ ✨ member!
🥰 Hope you enjoy your time here!
💬 Have a great & positive day! ✨
❖💙❖
👤 Added By: {addedBy}  
💎━━━━━━━━━━━━━━💎
~ BY: 𝐇𝐞𝐈𝐢•𝗟𝗨𝗠𝗢 💎✨`;

    msg = msg
      .replace(/{name}/g, nameArray.join(', '))
      .replace(/{type}/g, (memLength.length > 1) ? 'Friends' : 'Friend')
      .replace(/{soThanhVien}/g, memLength.join(', '))
      .replace(/{threadName}/g, threadName);

    // choose attachment: thread-specific -> random -> none
    let formPush;
    if (existsSync(pathGif)) {
      formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
    } else if (randomList.length != 0) {
      const pathRandom = join(__dirname, "cache", "joinvideo", "randomgif", `${randomList[Math.floor(Math.random() * randomList.length)]}`);
      formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
    } else {
      formPush = { body: msg, mentions };
    }

    return api.sendMessage(formPush, threadID);

  } catch (e) {
    console.log(e);
  }
};
