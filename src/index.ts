import "dotenv/config";
import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import mongoose from "mongoose";

import { MyContext } from "./types.js";
import { start } from "./commands/index.js";
import { User } from "./models/User.js";

const BOT_API_KEY = process.env.BOT_TOKEN;

if (!BOT_API_KEY) {
  throw new Error("BOT_API_KEY is not defined");
}

const bot = new Bot<MyContext>(BOT_API_KEY);

bot.use(hydrate());
// Відповідь на команду /start
bot.command("start", start);

// -------------------------------------------------------- menu
bot.callbackQuery("menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.callbackQuery.message?.editText(
    `🏪 Ви в головному меню\n
     Звідси ви можете попасти в  розділ з товарами
     та у свій профіль.👤\n Для переходу натисність на кнопку нижче:`,
    {
      reply_markup: new InlineKeyboard()
        .text("Товари", "products")
        .text("Профіль", "profile"),
    }
  );
});

// -------------------------------------------------------- products
bot.callbackQuery("products", async (ctx) => {
  await ctx.answerCallbackQuery();

  await ctx.callbackQuery.message?.editText(`Ви в розділі товари`, {
    reply_markup: new InlineKeyboard().text("<-- Повернутись", "backToMenu"),
  });
});

// -------------------------------------------------------- profile
bot.callbackQuery("profile", async (ctx) => {
  await ctx.answerCallbackQuery();

  const user = await User.findOne({
    telegramId: ctx.from?.id,
  });

  if (!user) {
    return await ctx.callbackQuery.message?.editText(
      `Для доступу до профіля потрібно зареєструватись, використовуючи команду /start`
    );
  }

  const registrationDate = user.createdAt.toLocaleDateString("ua-UA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  await ctx.callbackQuery.message?.editText(
    `Привіт ${ctx.from?.first_name}, \n
    Дата реєстрації: ${registrationDate}\n
    У вас ще немає замовлень,\n перейдіть у вкладку Товари. 
    `,
    {
      reply_markup: new InlineKeyboard().text("<-- Повернутись", "backToMenu"),
    }
  );
});

// ------------------------------------------------------- backToMenu
bot.callbackQuery("backToMenu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.callbackQuery.message?.editText(
    `Ви в головному меню магазину\
     Звідси ви можете попасти в  розділ з товарами\
     та у свій профіль. Для переходу натисність на кнопку нижче:`,
    {
      reply_markup: new InlineKeyboard()
        .text("Товари", "products")
        .text("Профіль", "profile"),
    }
  );
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
