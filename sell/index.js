const stage = require("./scenes")
let { actions } = require("./actions");
const { session } = require('telegraf');

let seller = async (bot, utl) => {
  bot.use(session());
  bot.use(stage.middleware());
  bot.use(actions)
  bot.launch({ dropPendingUpdates: true });
}

module.exports = seller;