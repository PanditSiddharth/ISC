let { sel, stu, adm } = require("./buttons");

// stud = student database, admd = admin database, seld = seller database
let { stud, admd, seld } = require("./db");
const stage = require("./scenes")

const { Scenes, session, Markup, Composer } = require('telegraf');

let edit = async (ctx, message, options = {}) => {
  try {
    return await ctx.editMessageText(message, options);
  } catch (err) {
    return await ctx.reply(message, options).catch(er => console.log(er))
  }
}

const sessionn = {};

let seller = async (bot, utl) => {

  bot.use(session());
  bot.use(stage.middleware());

  bot.action("admin", async (ctx, next) => {
    next()
    if (ctx.from.id != 1791106582)
      return ctx.answerCbQuery("You are not admin")

    else {
      await edit(ctx, "Admin Panel", { reply_markup: adm.main })
    }
  })


  bot.action("seller", async (ctx, next) => {
    next();
    let m = ctx.callbackQuery;
    ctx.answerCbQuery();
    console.log(ctx)
    if (session.hasOwnProperty(m.from.id)) {
      edit(ctx, "Signed in as " + sessionn[m.from.id].name, { reply_markup: sel.main })
    } else {
      try {
        let found = await seld.findOne({ sellerId: m.from.id });

        if (found) {
          edit(ctx, "Signed in as " + found.name, { reply_markup: sel.main });
        } else {
          ctx.scene.enter('register-seller')
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        // Handle database error
      }
    }
  })



  bot.launch({ dropPendingUpdates: true });
}

module.exports = seller;