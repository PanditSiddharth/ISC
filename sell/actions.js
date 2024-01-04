const { Scenes, Composer } = require('telegraf');
// sel = seller, stu = student, adm = admin, utl = utility
let { sel, stu, adm, utl, rpm, btn, rpmh, btnh } = require("./buttons");
let { seld, stud, tempsd } = require("./db");
let { sellers, seller, cato } = require("./globals");
let bot = new Composer();

let edit = async (ctx, message, options = {}) => {
  try {
    if (ctx.callbackQuery)
      return await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, undefined, message, options);
    else return await ctx.telegram.editMessageText(ctx.chat.id, ctx.message.message_id, undefined, message, options);
  } catch (err) {
    if (ctx.callbackQuery)
      ctx.deleteMessage(ctx.callbackQuery.message.message_id).catch(err => { console.error(err) });
    return await ctx.reply(message, options).catch(er => console.log(er))
  }
}

bot.action("seller", async (ctx, next) => {
  next();
  let m = ctx.callbackQuery;
  ctx.answerCbQuery();

  if (sellers.hasOwnProperty(m.from.id)) {
    edit(ctx, "Signed in as " + sellers[m.from.id].sellerName, { reply_markup: sel.main })
  } else {
    try {
      let found = await seld.findOne({ sellerId: m.from.id });

      if (found) {
        edit(ctx, "Signed in as " + found.sellerName, { reply_markup: sel.main });
        sellers[m.from.id] = found;
        let foundm = await tempsd.findOne({ sellerId: m.from.id });
        if (!foundm) {
          found = JSON.parse(JSON.stringify(found));
          delete found._id;
          delete found.__v;
          tempsd.create(found)
        }
      } else {
        ctx.scene.enter('seller-reg')
      }
    } catch (error) {
      console.error("Error fetching seller data:", error);
      // Handle database error
    }
  }
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
  if (dl.deletedCount > 0)
    edit(ctx, "Your id has been deleted successfully")
})

bot.action("admin", async (ctx, next) => {
  next()
  if (ctx.from.id != 1791106582)
    return ctx.answerCbQuery("You are not admin")

  else {
    await edit(ctx, "Admin Panel", { reply_markup: adm.main })
  }
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

bot.action(/(submit|cancel)(\d{7,12})/, async (ctx, next) => {
  next()
  if (ctx.match[1] == "submit") {
    let sellerId = +ctx.match[2];
    // console.log(id)
    let seller = await tempsd.findOne({ "sellerId": sellerId }).catch(er => console.error(er))

    if (!seller)
      return ctx.answerCbQuery('seller not found').catch(er => console.error(er))
    let sellerD = JSON.parse(JSON.stringify(seller))
    delete sellerD._id;
    delete sellerD.__v;
    ctx.reply(JSON.stringify(sellerD)).catch(er => console.error(er))
    let inst = await seld.create(sellerD).catch(er => console.error(er))
    if (!inst)
      return ctx.answerCbQuery("Error inserting seller data").catch(er => console.error(er))

    ctx.reply("Thanks we verified you now you can add your files in this bot by /addfile").catch(er => console.error(er))
    ctx.deleteMessage().catch(er => console.error(er))

  } else {
    ctx.reply("Cancelled your request. You can discuss me for reasons and how to join successfully by @PanditSiddharth").catch(er => console.error(er))
  }
})

bot.action("selAddProduct", async (ctx, next) => {
  next()
  let m = ctx.callbackQuery;
  ctx.answerCbQuery();
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
  edit(ctx, "Select category", { reply_markup: rpmh([{text: "Contact", request_contact: true}]) })
  
})
let actions = bot;
module.exports = { actions };