module.exports.config = {
  name: 'boxlist',
  version: '1.0.0',
  credits: 'Rasel Mahmud',
  hasPermssion: 2,
  description: '[Ban/Unban/Del/Out] List[Data] threads the bot has joined.',
  commandCategory: 'Admin',
  usages: '[page number]',
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) {
  const { threadID, messageID } = event;
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  const arg = event.body.split(" ");
  const idgr = handleReply.groupid[arg[1] - 1];
  const groupName = handleReply.groupName[arg[1] - 1];

  switch (handleReply.type) {
    case "reply":
      {
        const cmd = arg[0].toLowerCase();

        if (cmd === "ban") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          data.dateAdded = time;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
          return api.sendMessage(`🔒 ${groupName} has been banned.\n👑 Owner: Rasel`, idgr, () =>
            api.sendMessage(`✅ Ban Successful!\n🔷 Group: ${groupName}\n🔰 TID: ${idgr}`, threadID, () =>
              api.unsendMessage(handleReply.messageID)));
        }

        if (["unban", "ub"].includes(cmd)) {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 0;
          data.dateAdded = null;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(idgr, 1);
          return api.sendMessage(`🔓 ${groupName} has been unbanned.\n👑 Owner: Rasel`, idgr, () =>
            api.sendMessage(`✅ Unban Successful!\n🔷 Group: ${groupName}\n🔰 TID: ${idgr}`, threadID, () =>
              api.unsendMessage(handleReply.messageID)));
        }

        if (cmd === "del") {
          const data = (await Threads.getData(idgr)).data || {};
          await Threads.delData(idgr, { data });
          return api.sendMessage(`🗑️ Data deleted for group: ${groupName}\n🔰 TID: ${idgr}`, threadID, messageID);
        }

        if (cmd === "out") {
          api.sendMessage(`👋 Bot has left the group: ${groupName}\n👑 Owner: Rasel`, idgr, () =>
            api.sendMessage(`✅ Out Successful!\n🔷 Group: ${groupName}\n🔰 TID: ${idgr}`, threadID, () =>
              api.unsendMessage(handleReply.messageID, () =>
                api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr))));
          break;
        }
      }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  let threadList = [];
  let data;
  let i = 1;
  const perPage = 10; // groups per page

  try {
    data = global.data.allThreadID;
  } catch (e) {
    console.log(e);
  }

  for (const thread of data) {
    const info = await global.data.threadInfo.get(thread);
    const nameThread = info.threadName || "Unnamed Group";
    const msgCount = info.messageCount || "0";
    threadList.push({
      name: nameThread,
      tid: thread,
      msgCount
    });
  }

  if (threadList.length === 0) {
    return api.sendMessage("📭 No groups found!", threadID, messageID);
  }

  const totalPage = Math.ceil(threadList.length / perPage);
  let page = parseInt(args[0]) || 1;
  if (page < 1) page = 1;
  if (page > totalPage) page = totalPage;

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const listSlice = threadList.slice(start, end);

  let msg = `💠 Currently ${threadList.length} groups 💠\n\n`;
  for (let j = 0; j < listSlice.length; j++) {
    const grp = listSlice[j];
    msg += `━━━━━━━━━━━━━━━━━━
${start + j + 1}️⃣  ${grp.name}
🔰 TID: ${grp.tid}
💌 Message Count: ${grp.msgCount}\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━\n📄 Page ${page}/${totalPage}\n\n🎭 Reply ➡️ Out / Ban / Unban / Del [number]`;

  return api.sendMessage(msg, threadID, messageID);
};
