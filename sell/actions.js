const { Scenes, Composer } = require('telegraf');
// sel = seller, stu = student, adm = admin, utl = utility
let { sel, stu, adm, utl, rpm, btn, rpmh, btnh } = require("./buttons");
let { seld, stud, tempsd } = require("./db");
let { sellers, seller, cato } = require("./globals");
let { editR, edit, sendW, sleep } = require("./utils");
let bot = new Composer();

bot.action("seller", async (ctx, next) => {
  next();
  let m = ctx.callbackQuery;
  ctx.answerCbQuery();
ctx.deleteMessage();
  
  if (sellers.hasOwnProperty(m.from.id)) {
    if (sellers[m.from.id].status == "pending")
      return editR(ctx, "Please wait or change details by click on register: ", { reply_markup: rpm(btn("Register", "selRegister", "Close", "close")) }).catch((err) => console.log(err));

    if (["rejected", "none"].includes(sellers[m.from.id].status))
      return editR(ctx, "Please register yourself ", { reply_markup: rpm(btn("Register", "selRegister", "Close", "close")) }).catch((err) => console.log(err));

    editR(ctx, "Signed in as " + sellers[m.from.id].sellerName, { reply_markup: sel.main })
  } else {
    try {
      let found = await seld.findOne({ sellerId: m.from.id });

      if (found) {
        editR(ctx, "Signed in as " + found.sellerName, { reply_markup: sel.main }).catch((err) => console.log(err));
        sellers[m.from.id] = found;
        let foundm = await tempsd.findOne({ sellerId: m.from.id });
        if (!foundm) {
          found = JSON.parse(JSON.stringify(found));
          delete found._id;
          delete found.__v;
          tempsd.create(found)
        }
      } else {
        sellers[m.from.id] = {}
        sellers[m.from.id].req = 'enter';
        ctx.update.message = ctx?.callbackQuery?.message || ctx?.message;
        ctx.scene.enter('seller-reg')
      }
    } catch (error) {
      console.error("Error fetching seller data:", error);
      // Handle database error
    }
  }
})

bot.action("close", ctx => {
  ctx.deleteMessage().catch((err) => console.log(err));
})

bot.action('selRegister', async (ctx) => {
  ctx.answerCbQuery();
  ctx.deleteMessage().catch((err) => console.log(err));
  sellers[ctx.from.id].req = "enter";
  ctx.scene.enter('seller-reg');
})

bot.action("selEdit", async (ctx) => {

  edit(ctx, "Select what you want to update", {
    reply_markup: rpm(btn("Name", "selName", "Shop", "selShop", "About", "selAbout"),
      btn("Phone", "selPhone", "Address", "selAddress", "Back", "selMain"))
  })

  ctx.scene.enter("seller-edit")
})

bot.action("selMain", async (ctx) => {
  edit(ctx, "Signed in as " + ctx.from.first_name, {
    reply_markup: sel.main
  })
})

bot.action("selDelete", async (ctx) => {
  edit(ctx, "Are you sure you want to delete your id", {
    reply_markup: rpm(btn("Yes", "selDeleteYes", "No", "selMain"))
  })
})

bot.action("selDeleteYes", async (ctx) => {
  let dl = await seld.deleteOne({ sellerId: ctx.from.id })
  sellers[ctx.from.id] = null;
  delete sellers[ctx.from.id]
  if (dl.deletedCount > 0)
    edit(ctx, "Your id has been deleted successfully")
})

bot.action("admin", async (ctx, next) => {
  next()
  if (ctx.from.id != 1791106582)
    return ctx.answerCbQuery("You are not admin", {show_alert: true})

  else {
    ctx.answerCbQuery("Still in development")
  }
})

bot.action("student", async (ctx, next) => {
  next()
    ctx.answerCbQuery("Still in development", {show_alert: true})
  
})


bot.action("selDetails", async (ctx, next) => {
  next();
  try {
    let m = ctx.callbackQuery;
    ctx.answerCbQuery();
    let selInfo = await seld.findOne({ sellerId: m.from.id });

    if (selInfo) {
      sellers[m.from.id] = selInfo;
      edit(ctx, `
Name: ${selInfo.sellerName}
Id: ${selInfo.sellerId}
Phone: ${selInfo.sellerPhone}
Address: ${selInfo.address}
Shop: ${selInfo.shop}
About: ${selInfo.description}
Level: ${selInfo.level}
SoldIdtems: ${selInfo.soldItems}
SoldItemsPrice: ${selInfo.soldItemsPrice}
Time: ${selInfo.timestamp}
`, { reply_markup: rpm(btn("Edit", "selEdit", "Back", "selMain")) });
    }
  } catch (error) {
    console.error(error);
  }
})

bot.action(/(approveSel|cancelSel)(\d{7,12})/, async (ctx, next) => {
  next()

  let cb = ctx.callbackQuery;
  let photoId = cb.message.photo[cb.message.photo.length - 1].file_id;

  if (ctx.match[1] == "approveSel") {
    let sellerId = +ctx.match[2];
    let seller = await tempsd.findOne({ "sellerId": sellerId }).catch(er => console.error(er))

    if (!seller)
      return ctx.answerCbQuery('seller not found').catch(er => console.error(er))

    let sellerD = JSON.parse(JSON.stringify(seller))
    delete sellerD._id;
    delete sellerD.__v;

    // ctx.reply(JSON.stringify(sellerD)).catch(er => console.error(er))
    let inst = await seld.create(sellerD).catch(er => console.error(er))
    if (!inst)
      return ctx.answerCbQuery("Error inserting seller data", {show_alert: true}).catch(er => console.error(er))

    ctx.editMessageMedia({
      type: 'photo',
      media: photoId, // Provide the new media URL or file ID
      caption: cb.message.caption + "\nStatus: Approved"
    }).catch(er => console.error(er))
    
    ctx.telegram.sendMessage(sellerId, "Thanks we verified you now you can add your files in this bot by /addfile").catch(er => console.error(er))

  } else {
    ctx.editMessageMedia({
      type: 'photo',
      media: photoId, // Provide the new media URL or file ID
      caption: cb.message.caption + "\nStatus: Rejected"
    }).catch(er => console.error(er))

    ctx.telegram.sendMessage(+ctx.match[2], "Cancelled your request. You can discuss me for reasons and how to Register successfully: @PanditSiddharth").catch(er => console.error(er))
  }
})

bot.action("selAddProduct", async (ctx, next) => {
  next()
  let m = ctx.callbackQuery;
  return ctx.answerCbQuery("still in development", {show_alert: true});
  let catgor = Object.keys(cato)
  let arr = []
  for (let i = 0; i < catgor.length; i += 4) {
    let remainingCategories = catgor.length - i;
    if (remainingCategories >= 4) {
      arr.push(btnh(catgor[i], catgor[i + 1], catgor[i + 2], catgor[i + 3]));
    } else if (remainingCategories === 3) {
      arr.push(btnh(catgor[i], catgor[i + 1], catgor[i + 2]));
    } else if (remainingCategories === 2) {
      arr.push(btnh(catgor[i], catgor[i + 1]));
    } else if (remainingCategories === 1) {
      arr.push(btnh(catgor[i]));
    }
  }
  // return console.log(rpmh(...arr))
  // edit(ctx, "Select category", { reply_markup: rpmh(...arr) });
  edit(ctx, "Select category", { reply_markup: rpmh([{ text: "Contact", request_contact: true }]) })

})

bot.action("selProducts", async (ctx, next) => {
  next()
  let m = ctx.callbackQuery;
  return ctx.answerCbQuery("still in development", {show_alert: true});
  let catgor = Object.keys(cato)
  let arr = []
  for (let i = 0; i < catgor.length; i += 4) {
    let remainingCategories = catgor.length - i;
    if (remainingCategories >= 4) {
      arr.push(btnh(catgor[i], catgor[i + 1], catgor[i + 2], catgor[i + 3]));
    } else if (remainingCategories === 3) {
      arr.push(btnh(catgor[i], catgor[i + 1], catgor[i + 2]));
    } else if (remainingCategories === 2) {
      arr.push(btnh(catgor[i], catgor[i + 1]));
    } else if (remainingCategories === 1) {
      arr.push(btnh(catgor[i]));
    }
  }
  // return console.log(rpmh(...arr))
  // edit(ctx, "Select category", { reply_markup: rpmh(...arr) });
  edit(ctx, "Select category", { reply_markup: rpmh([{ text: "Contact", request_contact: true }]) })

})

// eighth step: last step
bot.action(/selSubmitReg|selCancelReg/, async (ctx, next) => {
  let cb = ctx.callbackQuery;
  if (!sellers[ctx.from.id]) {
    return ctx.answerCbQuery('Timeout', { show_alert: true }).catch(err => { console.error(err) });
  } else if (cb.data == "selCancelReg")
    ctx.answerCbQuery('Canceled: If you have any doubt contact @PanditSiddharth').catch(err => { console.error(err) })

  let selInfo = sellers[ctx.from.id];

  let mesText = `
  Name: ${selInfo.sellerName}
  Id: ${selInfo.sellerId}
  Phone: ${selInfo.sellerPhone}
  Address: ${selInfo.address}
  Shop: ${selInfo.shop}
  About: ${selInfo.description}
  Level: ${selInfo.level}
  SoldIdtems: ${selInfo.soldItems}
  SoldItemsPrice: ${selInfo.soldItemsPrice}
  Time: ${selInfo.timestamp}
    `

  let cpMes = await ctx.telegram.copyMessage(process.env.TO_CHAT, ctx.chat.id, ctx.callbackQuery.message.message_id).catch(err => { console.error(err) })

  selInfo.pic = cpMes.message_id;
  // ctx.reply(`Thank you, ! Registration completed.`);
  ctx.telegram.editMessageCaption(process.env.TO_CHAT, cpMes.message_id, undefined, mesText, { reply_markup: rpm(btn("Submit", "approveSel" + ctx.from.id, "Cancel", "cancelSel" + ctx.from.id)) }).catch(err => { console.error(err) })
  sellers[ctx.from.id].status = "pending";
  let mid = sellers[ctx.from.id].mid;
  delete sellers[ctx.from.id].mid
  delete sellers[ctx.from.id].req

  // find seller in temporary database
  let found = await tempsd.findOne({ sellerId: ctx.from.id }).catch(err => { console.error(err) })

  // if not found then create in temporary database
  if (!found) {
    let inst = await tempsd.create(selInfo).catch(err => { console.error(err) })

    // check if successfully inserted
    if (!inst) {
      sellers[ctx.from.id].mid = mid;
      return editR(ctx, "Something went wrong, try again later. or say to @PanditSiddharth")
      delete sellers[ctx.from.id].mid;
    }
  }

  // if not found 
  else {
    let upd = await tempsd.updateOne({ sellerId: ctx.from.id }, { $set: selInfo }, { upsert: true }).catch(err => { console.error(err) })
  }

  sellers[ctx.from.id].mid = mid;
  editR(ctx, "Thanks! Your registration completed please verify your self by messaging to @panditsiddharth").catch(err => { console.error(err) })

  sleep(100).then(() => {
    sellers[ctx.from.id] = null;
    delete sellers[ctx.from.id]
  })

})

let actions = bot;
module.exports = { actions };