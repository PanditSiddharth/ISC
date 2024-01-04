const { Scenes, session, Composer } = require('telegraf');
// sel = seller, stu = student, adm = admin, utl = utility
let { sel, stu, adm, utl, rpm, btn } = require("./buttons");
let { seld, stud, tempsd } = require("./db");
let { sellers, seller, editText, cato } = require("./globals");
let { edit, editW, sendW, sleep } = require("./utils");

function isQuery(ctx, opt = {}) {

  if (!ctx.callbackQuery) {
    return false;
  }

  sellers[ctx.from.id].no = true;
  sellers[ctx.from.id].req = null;

  ctx.answerCbQuery();
  let data = ctx.callbackQuery.data;
  if (data == 'skip') {
    ctx.wizard.steps[ctx.wizard.cursor](ctx)
  } else if (data == "cancel") {
    ctx.deleteMessage(ctx.callbackQuery.message.message_id).catch(er => { console.error(er) });
    sellers[ctx.from.id] = {};
    ctx.scene.leave();
  } else if (data == "back") {
    ctx.wizard.selectStep(ctx.wizard.cursor - 2);
    ctx.wizard.steps[ctx.wizard.cursor](ctx)
  } else if (data == "main") {
  }
  return true;
}

const { WizardScene } = Scenes;

// Step 1: Start the wizard
// const registrationWizard = new WizardScene('register-seller',
//   async (ctx) => {

//     editW(ctx, "Enter your original name: ", { reply_markup: utl.skipCancel }).catch(err => { console.error(err) })
//     sellers[ctx.from.id].req = "sellerName";

//   },
//   (ctx) => {
//     if (!sellers[ctx.from.id].no) {
//       if (isQuery(ctx)) return;
//     }
//     sellers[ctx.from.id].no = null
//     console.log(sellers[ctx.from.id])
//     if (sellers[ctx.from.id].req)
//       sellers[ctx.from.id][sellers[ctx.from.id].req] = ctx?.message?.text || ctx?.from?.first_name + ctx?.from?.last_name;
//     console.log(sellers[ctx.from.id])
//     editW(ctx, `Enter your current calling number: 
// You can enter your any other number or if your telegrams number is callable then click on bellow button: `, { reply_markup: utl.cancelBack }).catch(err => { console.error(err) })
//     sellers[ctx.from.id].req = "sellerPhone";

//     if (ctx.message || (ctx.wizard && ["skip", "back", "cancel"].includes(ctx.callbackQuery?.data)))
//       ctx.wizard.next(ctx);

//   },
//   (ctx) => {
//     if (!sellers[ctx.from.id].no)
//       if (isQuery(ctx)) return;
//     sellers[ctx.from.id].no = null

//     if (sellers[ctx.from.id].req)
//       sellers[ctx.from.id][sellers[ctx.from.id].req] = ctx.message.text;

//     editW(ctx, `Enter your shop name: `, { reply_markup: utl.skipBack }).catch(err => { console.error(err) })
//     sellers[ctx.from.id].req = "shop";
//     if (ctx.message || (ctx.wizard && ["skip", "back", "cancel"].includes(ctx.callbackQuery?.data)))
//       ctx.wizard.next(ctx);

//   },
//   (ctx) => {
//     if (!sellers[ctx.from.id].no)
//       if (isQuery(ctx)) return;
//     sellers[ctx.from.id].no = null

//     if (sellers[ctx.from.id].req)
//       sellers[ctx.from.id][sellers[ctx.from.id].req] = ctx.message.text;

//     editW(ctx, `Enter your address: `, { reply_markup: utl.skipBack }).catch(err => { console.error(err) })
//     sellers[ctx.from.id].req = "address";
//     if (ctx.message || (ctx.wizard && ["skip", "back", "cancel"].includes(ctx.callbackQuery?.data)))
//       ctx.wizard.next(ctx);
//   },
//   (ctx) => {
//     if (!sellers[ctx.from.id].no)
//       if (isQuery(ctx)) return;
//     sellers[ctx.from.id].no = null

//     if (sellers[ctx.from.id].req)
//       sellers[ctx.from.id][sellers[ctx.from.id].req] = ctx.message.text;

//     editW(ctx, `Enter about yourself: `, { reply_markup: utl.skipBack }).catch(err => { console.error(err) })
//     sellers[ctx.from.id].req = "description";
//     if (ctx.message || (ctx.wizard && ["skip", "back", "cancel"].includes(ctx.callbackQuery?.data)))
//       ctx.wizard.next(ctx);

//   },
//   (ctx) => {
//     if (!sellers[ctx.from.id].no)
//       if (isQuery(ctx)) return;
//     sellers[ctx.from.id].no = null

//     if (sellers[ctx.from.id].req)
//       sellers[ctx.from.id][sellers[ctx.from.id].req] = ctx.message.text;


//     editW(ctx, `Send your pic: `, { reply_markup: utl.cancelBack }).catch(err => { console.error(err) })
//     sellers[ctx.from.id].req = "pic";
//     if (ctx.message || (ctx.wizard && ["skip", "back", "cancel"].includes(ctx.callbackQuery?.data)))
//       ctx.wizard.next(ctx);
//   },
//   async (ctx) => {
//     if (!sellers[ctx.from.id].no)
//       if (isQuery(ctx)) return;
//     sellers[ctx.from.id].no = null
//     let selInfo = sellers[ctx.from.id];
//     if (!ctx.message) return;

//     if (!ctx.message.photo) {
//       selInfo.req = null;
//       ctx.wizard.selectStep(ctx.wizard.cursor - 1);
//       return ctx.wizard.steps[ctx.wizard.cursor](ctx)
//     }

//     let mesText = `Name: ${selInfo.sellerName}
// Id: ${selInfo.sellerId}
// Phone: ${selInfo.sellerPhone}
// Address: ${selInfo.address}
// Shop: ${selInfo.shop}
// About: ${selInfo.description}
// Level: ${selInfo.level}
// SoldIdtems: ${selInfo.soldItems}
// SoldItemsPrice: ${selInfo.soldItemsPrice}
// Time: ${selInfo.timestamp}
//           `
//     let cpMes = await ctx.telegram.copyMessage(ctx.chat.id, ctx.chat.id, ctx.message.message_id).catch(err => { console.error(err) })

//     ctx.telegram.editMessageCaption(ctx.chat.id, cpMes.message_id, undefined, "Verify your detils: \n\n" + mesText, { reply_markup: utl.cancelSubmit }).catch(err => { console.error(err) })
//     sellers[ctx.from.id].mid = cpMes.message_id;

//     if (ctx.message || (ctx.wizard && ["skip", "back", "cancel"].includes(ctx.callbackQuery?.data)))
//       ctx.wizard.next(ctx);
//   },
//   async (ctx) => {
//     if (!ctx.callbackQuery)
//       return
//     if (ctx.callbackQuery.data == "cancel") {
//       return ctx.deleteMessage(ctx.callbackQuery.message.message_id).catch(err => { console.error(err) })
//     }

//     let selInfo = sellers[ctx.from.id]

//     let mesText = `Name: ${selInfo.sellerName}
// Id: ${selInfo.sellerId}
// Phone: ${selInfo.sellerPhone}
// Address: ${selInfo.address}
// Shop: ${selInfo.shop}
// About: ${selInfo.description}
// Level: ${selInfo.level}
// SoldIdtems: ${selInfo.soldItems}
// SoldItemsPrice: ${selInfo.soldItemsPrice}
// Time: ${selInfo.timestamp}
//   `
//     let cpMes = await ctx.telegram.copyMessage(process.env.TO_CHAT, ctx.chat.id, ctx.callbackQuery.message.message_id).catch(err => { console.error(err) })

//     selInfo["pic"] = cpMes.message_id;
//     // ctx.reply(`Thank you, ! Registration completed.`);
//     ctx.telegram.editMessageCaption(process.env.TO_CHAT, cpMes.message_id, undefined, mesText, { reply_markup: rpm(btn("Submit", "submit" + ctx.from.id, "Cancel", "cancel" + ctx.from.id)) }).catch(err => { console.error(err) })
//     delete sellers[ctx.from.id].mid
//     delete sellers[ctx.from.id].no
//     delete sellers[ctx.from.id].req
//     let found = await tempsd.findOne({ sellerId: ctx.from.id }).catch(err => { console.error(err) })
//     if (!found) {
//       let inst = await tempsd.create(selInfo).catch(err => { console.error(err) })
//       if (!inst)
//         return editW(ctx, "Something went wrong, try again later. or say to @PanditSiddharth")
//     } else {
//       let upd = await tempsd.updateOne({ sellerId: ctx.from.id }, { $set: selInfo }, { upsert: true }).catch(err => { console.error(err) })
//     }
//     editW(ctx, "Thanks! Your registration completed please verify your self by messaging to @panditsiddharth").catch(err => { console.error(err) })
//     if (ctx.message || (ctx.wizard && ["skip", "back", "cancel"].includes(ctx.callbackQuery?.data)))
//       ctx.scene.next(ctx);
//   }
// );

async function editR(ctx, txt, options = {}) {
  if (!sellers[ctx.from.id]) {
    sellers[ctx.from.id] = {};
    let selinfo = sellers[ctx.from.id];
    selinfo.sellerId = ctx.from.id;
    selinfo.sellerName = ctx.from.first_name + " " +
      ctx.from.last_name;
    selinfo.timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  }

  if (ctx.message)
    ctx.deleteMessage().catch(err => { console.error(err) })
  
  let mes = {};
  if (!sellers[ctx.from.id].mid) {
    mes = await ctx.reply(txt, options).catch((err) => { console.log(err) });
    sellers[ctx.from.id].mid = mes.message_id;
  } 
    
  else {
    mes = await ctx.telegram.editMessageText(ctx.chat.id, sellers[ctx.from.id].mid, undefined, txt, options
    ).catch(async (err) => {
      if (sellers[ctx.from.id].mid)
        ctx.deleteMessage().catch(err => { console.error(err) });

      mes = await ctx.reply(txt, options).catch((errr) => { console.log(errr) });
      sellers[ctx.from.id].mid = mes.message_id;
    })
  }
  return mes;
}


let selE = new Scenes.BaseScene('seller-edit');
selE.enter(async (ctx) => { })
selE.on("message", async ctx => {
  let text = ctx.message.text;
  if (!editText[ctx.from.id] && editText[ctx.from.id].cmd)
    return;

  let iob = {}
  if (editText[ctx.from.id].cmd == "selName")
    iob = { "sellerName": text }
  else if (editText[ctx.from.id].cmd == "selShop")
    iob = { "shop": text }
  else if (editText[ctx.from.id].cmd == "selPhone")
    iob = { "sellerPhone": text }
  else if (editText[ctx.from.id].cmd == "selAddress")
    iob = { "address": text }
  else if (editText[ctx.from.id].cmd == "selAbout")
    iob = { "description": text }

  if (iob) {
    let upd = await seld.updateOne({ sellerId: ctx.from.id }, { $set: iob })
    if (upd.modifiedCount > 0)
      edit(ctx, "Successfully edited your details " + ctx.from.first_name, { reply_markup: rpm(btn("See Details", "selDetails", "Main Menu", "selMain")) })
    else edit(ctx, "Something went wrong, try again later. or say to @PanditSiddharth", { reply_markup: rpm(btn("Main Menu", "selMain")) })
  }
  editText[ctx.from.id] = "";
  delete editText[ctx.from.id];
  ctx.scene.leave();
})

selE.on("callback_query", async ctx => {
  editText[ctx.from.id] = {}
  editText[ctx.from.id].cmd = ctx.callbackQuery.data;
  if (editText[ctx.from.id].cmd == "selMain") {

    edit(ctx, "Signed in as " + ctx.from.first_name, {
      reply_markup: sel.main
    })
    ctx.scene.leave();
  } else {
    let dt = ctx.callbackQuery.data.replace("sel", "")
    edit(ctx, "Enter your " + dt, { reply_markup: rpm(btn("Cancel", "selMain")) })
  }
})

let selR = new Scenes.BaseScene('seller-reg');

let sSteps = ["sellerName", "sellerPhone",  "shop", "address", "description", "pic", "verify"]

selR.enter(async (ctx) => {
  editR(ctx, "Enter your original name: ", { reply_markup: utl.skipCancel }).catch(err => { console.error(err) })
  sellers[ctx.from.id] = {}
  sellers[ctx.from.id].req = "sellerName";
})

let selReg = async ctx => {
    let text = ctx.message.text;
    if (!sellers[ctx.from.id] || !sellers[ctx.from.id].req)
      return;

  if (sellers[ctx.from.id].req == "sellerName") {
    let selInfo = sellers[ctx.from.id]
        sellers[ctx.from.id].sellerName = ctx?.message?.text

      editR(ctx, `Enter your current calling number: 
      You can enter your any other number or if your telegrams number is callable then click on bellow button: `, { reply_markup: utl.cancelBack }).catch(err => { console.error(err) })
      sellers[ctx.from.id].req = "sellerPhone";

    } 
  else if(sellers[ctx.from.id].req == "sellerPhone") {
        sellers[ctx.from.id].sellerPhone = ctx.message.text;
      editR(ctx, `Enter your shop name: `, { reply_markup: utl.skipBack }).catch(err => { console.error(err) })

      sellers[ctx.from.id].req = "shop";
    }  
  else if (sellers[ctx.from.id].req == "shop") {
      sellers[ctx.from.id].shop = ctx.message.text;

      editR(ctx, `Enter your address: `, { reply_markup: utl.skipBack }).catch(err => { console.error(err) })
      sellers[ctx.from.id].req = "address";

      } 
  else if (sellers[ctx.from.id].req == "address") {
      sellers[ctx.from.id].address = ctx.message.text;
      editR(ctx, `Enter about yourself: `, { reply_markup: utl.skipBack }).catch(err => { console.error(err) })
      sellers[ctx.from.id].req = "description";
    } 
  else if(sellers[ctx.from.id].req == "description") {
      sellers[ctx.from.id].description = ctx.message.text;

      editR(ctx, `Send your pic: `, { reply_markup: utl.cancelBack }).catch(err => { console.error(err) })
      sellers[ctx.from.id].req = "pic";
    }  
  else if(sellers[ctx.from.id].req == "pic") {
    let selInfo = sellers[ctx.from.id]
      if (!ctx.message.photo) {
        return editR(ctx, `Send your pic: `, { reply_markup: utl.cancel })
      }

      let mesText = `Name: ${selInfo.sellerName}
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
      let cpMes = await ctx.telegram.copyMessage(ctx.chat.id, ctx.chat.id, ctx.message.message_id).catch(err => { console.error(err) })

      ctx.telegram.editMessageCaption(ctx.chat.id, cpMes.message_id, undefined, "Verify your detils: \n\n" + mesText, { reply_markup: utl.cancelSubmit }).catch(err => { console.error(err) })
      sellers[ctx.from.id].mid = cpMes.message_id;

      sellers[ctx.from.id].req = "verify";
    }
  else if(sellers[ctx.from.id].req == "verify") {

     let selInfo = sellers[ctx.from.id]

        let mesText = `Name: ${selInfo.sellerName}
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
        ctx.telegram.editMessageCaption(process.env.TO_CHAT, cpMes.message_id, undefined, mesText, { reply_markup: rpm(btn("Submit", "submit" + ctx.from.id, "Cancel", "cancel" + ctx.from.id)) }).catch(err => { console.error(err) })
        delete sellers[ctx.from.id].mid
        delete sellers[ctx.from.id].no
        delete sellers[ctx.from.id].req
        let found = await tempsd.findOne({ sellerId: ctx.from.id }).catch(err => { console.error(err) })
        if (!found) {
          let inst = await tempsd.create(selInfo).catch(err => { console.error(err) })
          if (!inst)
            return editW(ctx, "Something went wrong, try again later. or say to @PanditSiddharth")
        } else {
          let upd = await tempsd.updateOne({ sellerId: ctx.from.id }, { $set: selInfo }, { upsert: true }).catch(err => { console.error(err) })
        }
        editR(ctx, "Thanks! Your registration completed please verify your self by messaging to @panditsiddharth").catch(err => { console.error(err) })

  }
}
selR.on("message", selReg)

selR.on("callback_query", async ctx => { 
  let cb = ctx.callbackQuery; 
  let ctxx = Object.assign({}, ctx)

  let data = cb.data
  ctxx.message = ctx.callbackQuery.message;
ctxx.message.from = ctx.from;
  ctxx.from = ctx.from;
console.log(ctxx.message)
ctx.message = {}
  
ctx.message = Object.assign({}, ctx.message)
  let kx = {...ctx, message: ctxx.message, from: ctx.from}
  // ctx.message.from = ctxx.update?.callback_query?.from;
 console.log(kx)
  let sl = sellers[ctx.from.id]
  if (data == 'skip') {
  sl.req = sSteps[sSteps.indexOf(sl.req) + 1] 
    selReg(kx)
  } else if (data == "cancel") {
    ctx.deleteMessage(ctx.callbackQuery.message.message_id).catch(er => { console.error(er) });
    sellers[ctx.from.id] = {};
    ctx.scene.leave();
  } else if (data == "back") {
    sl.req = sSteps[sSteps.indexOf(sl.req) - 1] 
    
  } else if (data == "main") {
  }
})
// Create the stage and register the wizard
const stage = new Scenes.Stage([selR, selE], { ttl: 800000 });

module.exports = stage;
