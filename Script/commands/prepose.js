module.exports.config = {
  name: "propose",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "ＲＡＳＥＬ ＭＡＨＭＵＤ",
  description: "প্রতিটি প্রপোজ ৫ সেকেন্ড পর পর পাঠাবে 💘",
  commandCategory: "fun",
  usages: "*propose @mention",
  cooldowns: 5
};

const proposeTexts = [
  "🌹💞 আমার প্রতিটি ধ্বকধ্বক হৃদস্পন্দনে শুধু তোমার নাম বাজে... তুমি কি আমার হবে? 💘✨",
  "💍👑 পৃথিবীর সমস্ত সুখ একপাশে, আর তুমি আরেকপাশে — আমি শুধু তোমাকেই চাই 🥺❤️",
  "❤️🔥 তোমার চোখের দিকে তাকালেই মনে হয় স্বর্গ আমার সামনে নেমে এসেছে... হ্যাঁ বলবে তো? 🌸💖",
  "🌸✨ তুমি আসলেই আমার পৃথিবী রঙিন হয়ে যায়, প্লিজ আমাকে ছেড়ে যেও না 💕🌹",
  "🔥💫 আমি কখনও প্রার্থনা চাইনি, কিন্তু এবার চাই... তোমাকে আমার করে দাও আল্লাহ 🥺💞",
  "🌟🌍 আমি যদি তারকা হতাম, প্রতিরাতে শুধু তোমার স্বপ্ন রাঙাতাম 🌈💘",
  "🎶💖 আমার প্রতিটি কবিতা, প্রতিটি গান, প্রতিটি শ্বাসে শুধু তুমি... 🌹🔥",
  "🌞🥰 সকাল হোক বা রাত — আমার চিন্তায় শুধু তুমি... তুমি ছাড়া কিছুই চাই না 💫🌸",
  "🌈💝 যদি ভালোবাসা পাপ হয়, তবে আমি হাজারবার পাপ করতে রাজি... শুধু তোমার জন্য 💕✨",
  "👑💌 আমি তোমার জন্য আমার সমস্ত জীবন দিতে রাজি আছি... তুমি কি আমার ভালোবাসা গ্রহণ করবে? 💖🌹"
];

module.exports.run = async function({ api, event }) {
  const mentionID = Object.keys(event.mentions)[0];
  if (!mentionID) {
    return api.sendMessage("⚠️ ব্যবহার: *propose @mention (যাকে প্রপোজ করতে চাও তাকে mention করো)", event.threadID, event.messageID);
  }

  const mentionName = event.mentions[mentionID];

  // ১০টা প্রপোজ মেসেজ ৫ সেকেন্ড delay সহ
  for (let i = 0; i < proposeTexts.length; i++) {
    const msg = proposeTexts[i];
    await new Promise(resolve => setTimeout(resolve, 5000)); // ৫ সেকেন্ড delay
    api.sendMessage({
      body: `${mentionName} 💌\n${msg}`,
      mentions: [{ id: mentionID, tag: mentionName }]
    }, event.threadID, event.messageID);
  }
};
