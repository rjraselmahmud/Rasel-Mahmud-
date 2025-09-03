module.exports.config = {
  name: "acp",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Accept/Delete Facebook friend requests with list support",
  commandCategory: "bot id",
  usages: "acp | acp list | add <number/all> | del <number/all>",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const moment = require("moment-timezone");
  const args = event.body.split(" ").slice(1).map(a => a.toLowerCase());
  const senderID = event.senderID;

  // Fetch all pending friend requests
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  const data = await api.httpPost("https://www.facebook.com/api/graphql/", form);
  const allRequests = JSON.parse(data).data.viewer.friending_possibilities.edges;

  if (!allRequests.length) return api.sendMessage("No pending friend requests.", event.threadID);

  // If 'list', show all requests with number
  if (args[0] === "list") {
    let msg = "📋 Pending friend requests:\n";
    allRequests.forEach((user, i) => {
      const url = user.node.url ? user.node.url.replace("www.facebook","fb") : "No URL";
      msg += `\n${i + 1}. Name: ${user.node.name}`
           + `\nID: ${user.node.id}`
           + `\nUrl: ${url}`
           + `\nTime: ${moment(user.time*1000).tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\n`;
    });
    msg += "\nReply with: add <number/all> or del <number/all> to take action.";
    return api.sendMessage(msg, event.threadID);
  }

  // Function to accept/delete a request
  async function processRequest(user, action) {
    const docMap = {
      add: "3147613905362928",
      del: "4108254489275063"
    };
    const friendlyName = action === "add"
      ? "FriendingCometFriendRequestConfirmMutation"
      : "FriendingCometFriendRequestDeleteMutation";

    const reqForm = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: friendlyName,
      fb_api_caller_class: "RelayModern",
      doc_id: docMap[action],
      variables: JSON.stringify({
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          friend_requester_id: user.node.id,
          client_mutation_id: Math.floor(Math.random() * 1000).toString()
        },
        scale: 3,
        refresh_num: 0
      })
    };

    try {
      const res = await api.httpPost("https://www.facebook.com/api/graphql/", reqForm);
      const json = JSON.parse(res);
      if (json.errors) return false;
      return true;
    } catch {
      return false;
    }
  }

  // If just 'acp', accept sender's own request
  if (!args[0]) {
    const myRequest = allRequests.find(r => r.node.id === senderID);
    if (!myRequest) return api.sendMessage("You have no pending friend request to accept.", event.threadID);
    const success = await processRequest(myRequest, "add");
    return api.sendMessage(success ? `✅ Your friend request accepted.` : `❌ Failed to accept your request.`, event.threadID);
  }

  // Handle add/del command with number/all
  const action = args[0]; // add or del
  let targets = args.slice(1);

  if (!["add","del"].includes(action) || !targets.length) {
    return api.sendMessage("Use: add <number/all> or del <number/all>", event.threadID);
  }

  if (targets[0] === "all") targets = allRequests.map((_, i) => (i+1).toString());

  const successList = [];
  const failList = [];

  for (const t of targets) {
    const idx = parseInt(t) - 1;
    const user = allRequests[idx];
    if (!user) { failList.push(`#${t} not found`); continue; }
    const result = await processRequest(user, action);
    if (result) successList.push(user.node.name);
    else failList.push(user.node.name);
  }

  let msg = `✅ ${action === "add" ? "Accepted" : "Deleted"}: ${successList.length} request(s)\n${successList.join("\n")}`;
  if (failList.length) msg += `\n❌ Failed: ${failList.join("\n")}`;

  api.sendMessage(msg, event.threadID);
};
