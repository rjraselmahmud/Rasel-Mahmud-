module.exports.config = {
    name: "leave",
    eventType: ["log:unsubscribe", "log:remove"],
    version: "1.8.0",
    credits: "RASEL MAHMUD",
    description: "Compact one-line messages for leave or remove events",
};

module.exports.run = async function ({ api, event, Users }) {
    const { threadID, logMessageType, logMessageData } = event;

    // স্বেচ্ছায় leave
    if (logMessageType === "log:unsubscribe") {
        const leftId = logMessageData.leftParticipantFbId;
        if (!leftId || leftId == api.getCurrentUserID()) return;

        const name = global.data.userName.get(leftId) || await Users.getNameUser(leftId);
        const msg = `💔 ${name} left the group`;
        return api.sendMessage(msg, threadID);

    // অ্যাডমিন দ্বারা remove
    } else if (logMessageType === "log:remove") {
        const removedList = logMessageData.removedParticipants || [];
        const removerId = logMessageData.removedBy;
        const removerName = global.data.userName.get(removerId) || await Users.getNameUser(removerId);

        if (!removedList.length) return;

        for (const id of removedList) {
            if (id == api.getCurrentUserID()) continue; 
            const name = global.data.userName.get(id) || await Users.getNameUser(id);

            const msg = `🛑 ${name} removed by ${removerName}`;
            await api.sendMessage(msg, threadID);
        }
    }
};
