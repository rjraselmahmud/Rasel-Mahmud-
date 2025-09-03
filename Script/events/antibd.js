module.exports.config = {
  name: "antibd",
  eventType: ["log:user-nickname"],
  version: "1.9.0",
  credits: "Rasel Mahmud",
  description: "Prevents changing the Bot's nickname by unauthorized users"
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const { logMessageData, threadID, author } = event;
    const botID = api.getCurrentUserID();
    const { BOTNAME, ADMINBOT } = global.config;

    // Get current nickname
    let { nickname } = await Threads.getData(threadID, botID);
    nickname = nickname || BOTNAME;

    // If someone other than bot/admin changes the bot's nickname
    if (logMessageData.participant_id == botID && author != botID && !ADMINBOT.includes(author) && logMessageData.nickname != nickname) {
        // Reset nickname
        await api.changeNickname(nickname, threadID, botID);

        // Professional compact message
        const msg = `❌ Only my owner Rasel Mahmud may change this nickname.`;

        // Send message to thread
        return api.sendMessage(msg, threadID);
    }  
}
