module.exports.config = {
  name: "owner",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Show bot admin info",
  commandCategory: "system",
  usages: "[botadmin/owner/bot admin]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const botOwnerName = "Rasel Mahmud";
  const botOwnerHeight = "5 feet 8 inches";
  const botOwner = "Lives in Mymensingh";
  const botOwnerLocation = "studies in Rajshahi";
  const facebook1 = "https://www.facebook.com/raselmahmud.q";
  const facebook2 = "https://www.facebook.com/iiii.482394";
  const youtube = "https://youtube.com/@rmsilentgaming";

  const msg = `
╔═══════◇🌟◇═══════╗
         𝘽𝙊𝙏 𝙊𝙒𝙉𝙀𝙍 𝙄𝙉𝙁𝙊
╚═══════◇💠◇═══════╝

╔🪪 Name      		: ${botOwnerName}					
╠📏 Height     		: ${botOwnerHeight}
╠🏠 Location   		: ${botOwner}
╠🎓 Education  : ${botOwnerLocation}
╠🔗 Facebook 1  	: ${facebook1}
╠🔗 Facebook 2  	: ${facebook2}
╠🛡️ YouTube    	: ${youtube}
╚═══════════════════╝

═══════════◇✨◇═════════
Thanks for your interest in the owner!
𝐇𝐞𝐈𝐢•𝗟𝗨𝗠𝗢 💎✨
═══════════◇🔮◇═════════
`;

  const imgURL = "https://graph.facebook.com/100024220812646/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662";
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = __dirname + "/admin_image.jpg";

  try {
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(res.data, "binary"));

    api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => {
      fs.unlinkSync(path);
    }, event.messageID);

    api.setMessageReaction("🤺", event.messageID, () => {}, true);
  } catch (e) {
    console.error("Error fetching image:", e);
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
