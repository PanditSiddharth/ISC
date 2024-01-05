let { seld } = require('./db');
let sellers = {}
let editText = {}
let cato = { // categories
  bca: {},
  mca: {},
  bag: {},
  bscg: {},
  bcomg: {},
  bahih: {},
  bswg: {}
}

let sSteps = ["enter", "sellerName", "sellerPhone",  "shop", "address", "description", "pic", "verify"]

async function seller(ctx) {
  let id = ctx.from.id
  if (sellers[id] && sellers[id].sellerName) {
    return sellers[id]
  } else {
    let sel = await seld.findOne({ sellerId: id }).catch(err => { console.log(err) })
    if (sel) {
      sellers[id] = sel
      return sellers[id]
    } else {
      
      let k = {
        sellerName: ctx.from.first_name + " " + ctx.from.last_name,
        sellerId: ctx.from.id,
        sellerPhone: "",
        description: "",
        address: "",
        shop: "",
        level: 0,
        soldItems: 0,
        soldItemsPrice: 0,
        pic: 0,
        status: "none",
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      }
      if(sellers[id])
        sellers[id] = {...k, ...sellers[id]}
      else
        sellers[id] = k
      return sellers
      return sellers[id]
    }
  }
}

module.exports = { sellers, seller, editText, cato, sSteps }