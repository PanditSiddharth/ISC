let axios = require('axios')
let { Input } = require('tgind')
const https = require('https');
let fs = require('fs')

const cheerio = require('cheerio');

const agent = new https.Agent({
  rejectUnauthorized: false
});
let db;
let pyq = async (bot) => {
  const Database = require("@replit/database")
  db = new Database()
  // let res = await axios.get('https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20December%202022/QPDecember2022.htm', {
  //   httpsAgent: agent
  // });

  // console.log(list['BCS'])
  // fs.writeFileSync("./arr.txt", JSON.stringify(list))
  // Iterate over the table's children and print their tags

  bot.command('pq', (res) => {
    try {
      let match = res.text.match(/[A-Za-z]{2,6}\-[0-9]{1,3}/g)
      if (!match) {
        del(res)
        return send(res, "Incorrect format\nPlease write as for example\n\n/pq mcs-11\n/pq eco-2")
      }

      let nm = match[0]
      res.send("Select your degree", {
        reply_markup: {
          inline_keyboard: [
            [{ "text": "BCA", "callback_data": `{ "dg": "BCA", "nm": "${nm}", "org": "SOCIS"}` },
            { "text": "more", "callback_data": `{ "dg":"tsr", "nm": "${nm}", "org": "cbcs"}` }
            ]
          ]
        }
      })

    } catch (err) { }
  })

  bot.on('callback_query', async (res) => {
    try {
      if (!res.data.includes('dg'))
        return
      res.ansQuery()
      let msg = JSON.parse(res.data)

      let aa = { "dg": msg.dg, "nm": msg.nm, "org": msg.org }

      if (!res.data.includes("session")) {
        // return console.log(JSON.stringify({...aa, "session": "2022"}))

        res.edit(res.message_id, "Select session for " + msg.nm, {
          reply_markup: {
            inline_keyboard: [
              [{ "text": "2022", "callback_data": JSON.stringify({ ...aa, "session": "2022" }) },
              { "text": "2021", "callback_data": JSON.stringify({ ...aa, "session": "2021" }) }
              ],
              [{ "text": "2020", "callback_data": JSON.stringify({ ...aa, "session": "2020" }) },
              { "text": "2019", "callback_data": JSON.stringify({ ...aa, "session": "2019" }) }]
            ]
          }
        })

      } else {
        send(res, "Wait while processing...\nbot by @PanditSiddharth\nMore @ignou_study_channel", 5000)
        await res.del(res.message_id)
        msg.dg = msg.dg.replace("tsr", "bag-bcomg-bscg")
        let zero = msg.nm.match(/[A-Za-z]{2,6}\-0[0-9]{1,2}/g)
        if (zero) {
          let a = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "june", dg: msg.dg, res })
          let b = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "december", dg: msg.dg, res })
          msg.nm = msg.nm.replace('0', '')
          if (!a)
            a = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "june", dg: msg.dg, res })
          if (!b)
            b = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "december", dg: msg.dg, res })
          if (!a)
            send(res, `${msg.nm} june ${msg.session} Not found`)
          if (!b)
            send(res, `${msg.nm} december ${msg.session} Not found`)
        }

        else {
          let a = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "june", dg: msg.dg, res })
          let b = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "december", dg: msg.dg, res })
          msg.nm = msg.nm.replace(/\d+/, match => "0" + match)

          if (!a)
            a = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "june", dg: msg.dg, res })
          if (!b)
            b = await download({ org: msg.org, nm: msg.nm, session: msg.session, sn: "december", dg: msg.dg, res })
          if (!a)
            send(res, `${msg.nm} june ${msg.session} Not found`)
          if (!b)
            send(res, `${msg.nm} december ${msg.session} Not found`)
        }

      }
      // console.log(res)
      // return console.log(res)
    } catch (error) { }
  })

}


module.exports = pyq

let download = async (obj = {}) => {
  // await db.set("feg-2", "SOCIS")

  // let dbb = await db.get("feg-2")
  //   if(dbb)
  //     obj.
  // return console.log(dbb)

  try {
    function url() {
      if (obj.session < 2022 && obj.dg == "BCA")
        return `https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20${obj.sn}%20${obj.session}/${obj.org}/PGDCA%20ADCA%20MCA/${obj.nm}.pdf`
      else
        return `https://webservices.ignou.ac.in/Pre-Question/Question%20Paper%20${obj.sn}%20${obj.session}/${obj.org}/${obj.dg}/${obj.nm}.pdf`
    }


    // send(obj.res, "sending " + obj.session + obj.sn, 2000)

    const response = await axios.get(url(), {
      httpsAgent: agent,
      responseType: 'arraybuffer'
    })
    // .catch((err)=> {console.log(err); obj.res.send(err.message)})

    const data = response.data;

    fs.writeFileSync(`./files/${obj.nm} ${obj.sn + obj.session}.pdf`, data, 'utf8');
    // console.log('File saved successfully!');

    await obj.res.sendDoc(new Input.fromLocal(`./files/${obj.nm} ${obj.sn + obj.session}.pdf`))
    return true

    try {
      fs.unlinkSync(`./files/${obj.nm} ${obj.sn + obj.session}.pdf`)
    } catch (error) { }
    // Do something with the response data
  } catch (error) {
    // Handle the error
    // obj.res.answerCallbackQuery("hi")
    // send(obj.res, obj.sn + obj.session + " " + error.message)
    return false
    // console.log(error)
  }

}


// let list = {
// "BCS":"SOCIS",
// "CS":"SOCIS",
// "ECO":"SOCIS",
// "FEG":"SOCIS",
// "MCS":"SOCIS",
// "MCSE":"SOCIS",
// "BANS":"CBCS",
// "BANE":"CBCS",
// "BABG":"CBCS",
//   }

let list = `BANS BABG BANE BBCCT BBCS BBYCT BBYET BCHCT BEVAE 
BZYCT BCOC BEGAE BCOC BCOLA BCOE BCOG BCOS BECC BECE  BEGE
BECS BEGC BEGG BEGLA BEGS BES BESC BFD BESE BFDI BGDG 
BGGCT BGP BGGET BGULA BGYCT BGYET BHDC BHDE BHDLA BHDS 
BHIC BHIE BHMCT BHMCT BMTC BMYLA BMTE BODLA BPAC BPAE 
BPAG BPAS BPBLA BPCC BPCE BPCS BPHCT BPHET BPSC BPSC BPSC`

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function send(res, msg, tim = 10000) {
  try {
    let m = await res.send(msg)
    sleep(tim)
      .then(() => {
        res.del(m.message_id)
      })
    return m
  } catch (error) { }
}

function del(res, tim = 10000) {
  try {
    sleep(tim)
      .then(() => {
        res.del().catch((er) => { })
      })
  } catch (error) { }
}

let cls = [
  "SOMS", "CBCS", "SOCIS", "SOE", "SOCE", "SOHE", "SOHS", "STRIDE", "SOET", "SOSS", "SOH", "SOS", "SOA", "SOGDS", "SOJNMS", "SOL", "SOTST", "SOVET", "SOEDS", "SOPVA", "SOITS", "SOFL", "SOSW", "SOTHSM"
]