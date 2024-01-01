const { Scenes, session, Composer } = require('telegraf');
// sel = seller, stu = student, adm = admin, utl = utility
let { sel, stu, adm, utl } = require("./buttons");


const sellerJson = {
  sellerName: "",
  sellerId: 0,
  sellerPhone: 0,
  description: "",
  address: "",
  level: 0,
  soldItems: 0,
  soldItemsPrice: 0,
  pic: 0,
  timestamp: ""
}

function assign(ctx, what){
ifctx.message)
  sellerJson[what] = ctx.from.first_name;
}

const { WizardScene } = Scenes;

// Step 1: Start the wizard
const registrationWizard = new WizardScene('register-seller',
  (ctx) => {
sellerJson.sellerId = 
    ctx.reply(`[${ctx.wizard.cursor + 1}/${ctx.wizard.steps.length}]: Enter your original name: `, { reply_markup: utl.skipCancel });
    ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply(`You're ${ctx.wizard.cursor + 1} out of ${ctx.wizard.steps.length} steps.
Enter your current calling number: `, { reply_markup: utl.cancelBack });
    ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply(`You're ${ctx.wizard.cursor + 1} out of ${ctx.wizard.steps.length} steps.
Enter your shop name: `, { reply_markup: utl.skipBack });
    ctx.wizard.next();
  },
  (ctx) => {
    // ctx.session.email = ctx.message.text;
    ctx.wizard.selectStep(1);
    ctx.reply(`Thank you, ! Registration completed.`);
    // ctx.scene.leave(); // End the wizard
  }
);

// Create the stage and register the wizard
const stage = new Scenes.Stage([registrationWizard], { ttl: 800000 });


module.exports = stage;
