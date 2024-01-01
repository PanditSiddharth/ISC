const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');
(async () => {
  let res = await axios.post('https://hall_ticket.ignou.ac.in/HALLticketjun23/IGNOUHallTicketJun2023.aspx', {
    CheckDeclaration: 'Y',
    txtEnrNo: '2100791043',
    ddlProgram: 'BCA',
    submit1: '1'
  }, {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
    headers: {
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })

  const $ = cheerio.load(res.data);


  const examScheduleTable = $('table')
  const rows = examScheduleTable.find('tr').slice(1) // slice to skip header row
  console.log(rows)



})()