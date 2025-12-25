import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const backToMenu = async (ctx: CallbackQueryContext<MyContext>) => {
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
};
