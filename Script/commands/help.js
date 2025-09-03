module.exports.config = {
  name: "help",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Show all bot commands without categories",
  commandCategory: "system",
  usages: "[command name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  // Single command info
  if (args[0]) {
    const command = commands.get(args[0]) || commands.get(global.client.aliases.get(args[0]));
    if (!command) return api.sendMessage(`❌ Command '${args[0]}' not found.`, threadID, messageID);

    return api.sendMessage(
      `📖 Command Info:
━━━━━━━━━━━━━━━━━━
🔹 Name: ${command.config.name}
📌 Description: ${command.config.description || "No description"}
⌛ Cooldown: ${command.config.cooldowns || 0}s
✍️ Usage: ${command.config.usages || "Not specified"}
━━━━━━━━━━━━━━━━━━`,
      threadID,
      messageID
    );
  }

  // List all commands without showing categories
  let allCmds = [];
  commands.forEach(cmd => allCmds.push(cmd.config.name));

  // Split into multiple lines if needed
  let chunkSize = 5; // number of commands per line
  let msgCmds = [];
  for (let i = 0; i < allCmds.length; i += chunkSize) {
    msgCmds.push("❖ " + allCmds.slice(i, i + chunkSize).join(" ❖ "));
  }

  let msg = "╔════❰ ( 𝐇𝐞𝐈𝐢•𝗟𝗨𝗠𝗢 💎✨ ) ❱════╗\n\n";
  msg += msgCmds.join("\n") + "\n\n";
  msg += `┏─━─━─━─━─━─━─━─▢
┃ ⬤ Total cmds: ${commands.size}
┃ ⬤ Type [*help <cmd>] to learn the usage.
┃ ⬤ Type '*supportgc' to join supportgc
┃ ⬤ Type '*addowner' to add bot admin to your group chat
┗─━─━─━─━─━─━─━─▢`;

  return api.sendMessage(msg, threadID, messageID);
};
