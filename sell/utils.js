let { sellers, seller } = require('./globals')

async function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

let edit = async (ctx, message, options = {}) => {
  try {
    if (ctx.callbackQuery)
      return await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, undefined, message, options);
    else return await ctx.telegram.editMessageText(ctx.chat.id, ctx.message.message_id, undefined, message, options);
  } catch (err) {
    return await ctx.reply(message, options).catch(er => console.log(er))
  }
}

async function editW(ctx, txt, options = {}) {
  if (!sellers[ctx.from.id]) {
    sellers[ctx.from.id] = {};
    let selinfo = sellers[ctx.from.id];
    selinfo.sellerId = ctx.from.id;
    selinfo.sellerName = ctx.from.first_name + " " +
      ctx.from.last_name;
    selinfo.description = ""
    selinfo.sellerPhone = 0;
    selinfo.shop = "";
    selinfo.address = "";
    selinfo.level = 0;
    selinfo.soldItems = 0;
    selinfo.soldItemsPrice = 0;
    selinfo.pic = 0;
    selinfo.timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  }

  if (ctx.message)
    ctx.deleteMessage().catch(err => { console.error(err) })
  let mes = {};
  if (!sellers[ctx.from.id].mid) {
    mes = await ctx.reply(`[${ctx.wizard.cursor + 1}/${ctx.wizard.steps.length}]: ` + txt, options).catch((err) => { console.log(err) });

    sellers[ctx.from.id].mid = mes.message_id;

  } else {
    mes = await ctx.telegram.editMessageText(ctx.chat.id, sellers[ctx.from.id].mid,
      undefined,
      `[${ctx.wizard.cursor + 1}/${ctx.wizard.steps.length}]: ` + txt,
      options
    ).catch(async (err) => {
      if (sellers[ctx.from.id].mid)
        ctx.deleteMessage().catch(err => { console.error(err) });

      mes = await ctx.reply(`[${ctx.wizard.cursor + 1}/${ctx.wizard.steps.length}]: ` + txt, options).catch((errr) => { console.log(errr) });

      sellers[ctx.from.id].mid = mes.message_id;
    })
  }
  return mes;
}

async function sendW(ctx, txt, options = {}) {
  let m = await ctx.reply(`[${ctx.wizard.cursor + 1}/${ctx.wizard.steps.length}]: ` + txt, options).catch((err) => { console.log(err) });
  return m;
}

module.exports = { sleep, edit, editW, sendW }