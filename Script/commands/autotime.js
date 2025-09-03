const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
    name: 'autosent',
    version: '10.0.1',
    hasPermssion: 0,
    credits: 'Rasel Mahmud',
    description: 'Automatically shows scheduled times in stylish designer font (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

// শুধু টাইম লিস্ট রাখা (মেসেজ বাদ)
const messages = [
    { time: '12:00 AM', message: '', special: null },
    { time: '1:00 AM', message: '', special: null },
    { time: '2:00 AM', message: '', special: null },
    { time: '3:00 AM', message: '', special: null },
    { time: '4:00 AM', message: '', special: null },
    { time: '5:00 AM', message: '', special: null },
    { time: '6:00 AM', message: '', special: null },
    { time: '7:00 AM', message: '', special: null },
    { time: '8:00 AM', message: '', special: null },
    { time: '9:00 AM', message: '', special: null },
    { time: '10:00 AM', message: '', special: null },
    { time: '11:00 AM', message: '', special: null },
    { time: '12:00 PM', message: '', special: null },
    { time: '1:00 PM', message: '', special: null },
    { time: '2:00 PM', message: '', special: null },
    { time: '3:00 PM', message: '', special: null },
    { time: '4:00 PM', message: '', special: null },
    { time: '5:00 PM', message: '', special: null },
    { time: '6:00 PM', message: '', special: null },
    { time: '7:00 PM', message: '', special: null },
    { time: '8:00 PM', message: '', special: null },
    { time: '9:00 PM', message: '', special: null },
    { time: '10:00 PM', message: '', special: null },
    { time: '11:00 PM', message: '', special: null }
];

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ AUTOSENT COMMAND LOADED (BD TIME) ============"));

    messages.forEach(({ time }) => {
        const [hour, minute, period] = time.split(/[: ]/);
        let hour24 = parseInt(hour, 10);
        if (period === 'PM' && hour !== '12') {
            hour24 += 12;
        } else if (period === 'AM' && hour === '12') {
            hour24 = 0;
        }

        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = hour24;
        rule.minute = parseInt(minute, 10);

        schedule.scheduleJob(rule, () => {
            // কোনো মেসেজ পাঠানো হবে না
            if (!global.data?.allThreadID) return;
            global.data.allThreadID.forEach(threadID => {
                // message পাঠানোর লাইন মুছে ফেলা হয়েছে
            });
        });

        // Stylish designer style টাইম দেখানো (Unicode + emoji)
        const stylishTime = `⏰ 𝑇𝑖𝑚𝑒 : ${hour}:${minute} ${period}`;
        console.log(chalk.hex('#ff6ec7').bold(stylishTime));
    });
};

module.exports.run = () => {
    // Main logic is in onLoad
};
