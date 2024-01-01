const { Composer, Markup, Scenes, session, Telegraf } = require("telegraf");

const stepHandler = new Composer();
stepHandler.action("next", async ctx => {
  await ctx.reply("Step 2. Via inline button");
  return ctx.wizard.next();
});
stepHandler.command("next", async ctx => {
  await ctx.reply("Step 2. Via command");
  return ctx.wizard.next();
});
stepHandler.use(ctx =>
  ctx.replyWithMarkdown("Press `Next` button or type /next"),
);

const superWizard = new Scenes.WizardScene(
  "super-wizard",
  async ctx => {
    await ctx.reply(
      "Step 1",
      Markup.inlineKeyboard([
        Markup.button.url("❤️", "http://telegraf.js.org"),
        Markup.button.callback("➡️ Next", "next"),
      ]),
    );
    return ctx.wizard.next();
  },
  stepHandler,
  async ctx => {
    await ctx.reply("Step 3");
    return ctx.wizard.next();
  },
  async ctx => {
    await ctx.reply("Step 4");
    return ctx.wizard.next();
  },
  async ctx => {
    await ctx.reply("Done");
    return await ctx.scene.leave();
  },
);

const bot = new Telegraf(process.env.TOKEN);
const stage = new Scenes.Stage([superWizard], {
  default: "super-wizard",
});
bot.use(session());
bot.use(stage.middleware());

bot.launch();