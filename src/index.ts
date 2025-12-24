import "dotenv/config";
import { Bot } from "grammy";
import { GrammyError, HttpError } from "grammy";
import mongoose from "mongoose";
import { User } from "./models/User.js";

const BOT_API_KEY = process.env.BOT_TOKEN;

if (!BOT_API_KEY) {
  throw new Error("BOT_API_KEY is not defined");
}

const bot = new Bot(BOT_API_KEY);

// Відповідь на команду /start
bot.command("start", async (ctx) => {
  if (!ctx.from) {
    return ctx.reply("User info is not availbale");
  }

  const { id, first_name, username } = ctx.from;
  try {
    const existingUser = await User.findOne({ telegramId: id });
    if (existingUser) {
      return ctx.reply(`${existingUser.userName} Ви вже зареєстровані`);
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      userName: username,
    });
    newUser.save();
    ctx.reply(`${newUser.userName} ви зарєструвались в системі`);
  } catch (error) {
    console.error("Помилка реєстрації користувача", error);
    ctx.reply("Реєстрація не відбулась, спробуйте пізніше");
  }
});

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
