import "dotenv/config";
import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import mongoose from "mongoose";

import { MyContext } from "./types.js";
import { start } from "./commands/index.js";

const BOT_API_KEY = process.env.BOT_TOKEN;

if (!BOT_API_KEY) {
  throw new Error("BOT_API_KEY is not defined");
}

const bot = new Bot<MyContext>(BOT_API_KEY);
bot.use(hydrate(), start);

bot.callbackQuery('menu', (ctx)=> {
  ctx.answerCallbackQuery()
  
  ctx.callbackQuery.message?.editText(
    'Ви в головному меню магазину.\n
     Звідси ви можете попасти в  розділ з товарами'
  )
})

// Відповідь на команду /start
bot.command("start");

// Відповідь на будь-яке повідомлення
bot.on("message:text", (ctx) => {
  ctx.reply(ctx.message.text);
});

// Обробка помилок згідно інструкції
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Функція запуску бота
async function startBot() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URL is not defined");
  }
  try {
    await mongoose.connect(MONGODB_URI);
    bot.start();
    console.log("MongoDB connected & bot started ");
  } catch (error) {
    console.error("Error in startBot:", error);
  }
}

startBot();
