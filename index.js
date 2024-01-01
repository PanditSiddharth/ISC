const cheerio = require('cheerio');
const axios = require('axios');
const { Telegraf } = require('telegraf');

const express = require('express');
const app = express();
// let hall = require('./hall.js')
const https = require('https');
const seller = require('./sell');
const agent = new https.Agent({
  rejectUnauthorized: false
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

let bot = new Telegraf(process.env.TOKEN, { handlerTimeout: 1000000 })
// hall(bot)
// pyq(bot)


async function igres(data) {
  try {

    let dt = JSON.parse(data)
    let url = `https://termendresult.ignou.ac.in/TermEnd${dt.text}/TermEnd${dt.text}.asp`
    // let url = "https://termendresult.ignou.ac.in/TermEndDec22/TermEndDec22.asp"   
    let response = await axios.get(url, {
      httpsAgent: agent,
    })

    let Cookie;
    // Check for set-cookie header
    if (response.headers['set-cookie']) {
      Cookie = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join(';');
    }

    let result = await axios.post(url, {
      eno: dt.eno,
      myhide: "OK"
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie,
      },
      httpsAgent: agent,
    });

    const html = result.data;
    const $ = cheerio.load(html);

    let results = [];
    results.push(`𝗬𝗼𝘂𝗿 𝗶𝗴𝗻𝗼𝘂 𝗥𝗲𝘀𝘂𝗹𝘁 \n𝗦𝘂𝗯𝗷𝗲𝗰𝘁 ㅤㅤㅤㅤ𝗡𝘂𝗺𝗯𝗲𝗿𝘀`);
    $('table tr:not(:first-child)').each(function() {
      const tds = $(this).find('td');
      const courseCode = $(tds[0]).text().trim();
      const marks = $(tds[1]).text().trim();
      const maxMarks = $(tds[2]).text().trim();

      results.push(
        `${courseCode} ㅤㅤㅤㅤ${marks} in ${maxMarks}`
      );
    });
    results = await results.join('\n');
    // console.log(results)
    return results
  } catch (error) {
    console.error(error)
  }
}

async function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function del(message_id, delTime = 10) {
  try {
    await util.sleep(delTime);
    if (message_id)
      return await ctx.deleteMessage(message_id);
    else
      return await ctx.deleteMessage();
  }
  catch (error) {
    return false;
  }
}
/**
 *
 * @param message
 * @param options
 *
 * You can give your message and in second param
 * time to delete that message or in second you can add {"time": 10} // after 10 seconds message will be delete
 *
 */
async function send(ctx, message, options = {}) {
  try {
    let time = 10;
    if (typeof options === 'number')
      time = options;
    if (options.time) {
      time = options.time;
      delete options.time;
    }
    let m = await ctx.reply(message, options);
    del(m.message_id, time);
  }
  catch (error) {
  }
}

let util = { send, sleep, del }

bot.start(async (ctx) => {
  let m = ctx.message;

  if (m.chat.type == 'private') {
    ctx.reply(`Hello ${m.from.first_name}, I am IGNOU Bot
there are many things you can do here.
Check our /services
Check how to use this bot/help
Login as 👇👇`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Seller",
              callback_data: "seller"
            },
            {
              text: "Student",
              callback_data: "student"
            }
          ],
          [
            {
              text: "Admin",
              callback_data: "admin"
            }
          ]
        ]
      }
    })
  }
  else {
    ctx.reply(`Hello ${m.from.first_name}, I am IGNOU Bot
there are many things you can do in this bot.
Check our /services
Check how to use this bot /help
`)
  }
})

bot.on("message", async (ctx, next) => {
  try {
    next()
    let m = ctx.message;

    if ((m.text + "").startsWith("/isc")) {
      ctx.deleteMessage(m.message_id).catch((err) => { })
      let enr = m.text.match(/\d+/)

      if (!enr || enr[0].length < 9)
        return util.send(ctx, "invalid enrollment number: \nAfter writting /isc write your enrollment number", { time: 300 }).catch((err) => { })

      const replyMarkup = {
        inline_keyboard: [
          [{ text: "June 23", callback_data: JSON.stringify({ "eno": enr[0], "text": "June23" }) },
          { text: "Dec 22", callback_data: JSON.stringify({ "eno": enr[0], "text": "Dec22" }) },
          { text: "June 22", callback_data: JSON.stringify({ "eno": enr[0], "text": "June22" }) }],
          [{ text: "Dec 21", callback_data: JSON.stringify({ "eno": enr[0], "text": "Dec21" }) },
          { text: "June 21", callback_data: JSON.stringify({ "eno": enr[0], "text": "June21" }) },
          { text: "Close", callback_data: "close" }]
        ],
      };

      send(ctx, "For which result you want to see ?", { reply_markup: replyMarkup }).catch((err) => { })
    }
  } catch (error) {
    console.error("message", error)
  }
})

bot.on("callback_query", async (ctx, next) => {
  try {

    let m = ctx.update.callback_query;

    if (!m.data.includes('eno') || !m.data.includes('text'))
      return next()
    ctx.answerCbQuery().catch((err) => { })
    // return console.log(m)
    del(m.message_id).catch((er) => { })
    if (m.data == "close") {
      return;
    }

    let res = await igres(m.data)

    if (res) {
      if (res.match(/\d/))
        return send(ctx, res).catch((err) => { })
      util.send(ctx, "Your result has not declared yet for " + JSON.parse(m.data).text + " Session", { time: 80 }).catch((err) => { })

    }
    else
      util.send(ctx, "Some error with this enrollment or in date you seleceted", { time: 20 }).catch((err) => { })

  } catch (error) {
    console.error("query", error)
  }
})

seller(bot, util)