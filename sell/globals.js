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

async function seller(ctx) {
  let id = ctx.from.id
  if (sellers[id]) {
    return sellers[id]
  } else {
    let sel = await seld.findOne({ sellerId: id }).catch(err => { console.log(err) })
    if (sel) {
      sellers[id] = sel
      return sellers
    } else {
      sellers[id] = {
        sellerName: "",
        sellerId: 0,
        sellerPhone: "",
        description: "",
        address: "",
        shop: "",
        level: 0,
        soldItems: 0,
        soldItemsPrice: 0,
        pic: 0,
        timestamp: ""
      }
      return sellers[id]
    }
  }
}

module.exports = { sellers, seller, editText, cato }