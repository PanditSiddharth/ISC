// const { Composer, Markup, Scenes, session, Telegraf, message } = require("telegraf");

// const bot = new Telegraf(process.env.TOKEN);

// bot.on(message('photo'), async (ctx) => {
//   // Get the array of photos sent to the bot
//   const photos = ctx.message.photo;

//   // The last item in the array usually represents the largest photo size
//   const largestPhoto = photos[photos.length - 1];
//   console.log(ctx.message)
//   // Extract the file ID of the photo
//   const photoId = largestPhoto.file_id;

//   const chatId = ctx.message.chat.id;
//   const messageId = ctx.message.message_id;

//   try {
//     // Editing the message media with the new photo ID
//     await ctx.telegram.editMessageMedia(
//       chatId,
//       messageId,
//       null,
//       {
//         media: photoId,
//       }
//     );
//     console.log('Message media edited successfully!');
//   } catch (error) {
//     console.error('Error editing message media:', error);
//   }
// });

// bot.launch();

const obj = {
  key1: 'value1',
  key2: 'value2',
  key3: 'lol'
};

Object.defineProperties(obj, {
  key1: { enumerable: false },
  key2: { enumerable: false }
});

console.log(obj);