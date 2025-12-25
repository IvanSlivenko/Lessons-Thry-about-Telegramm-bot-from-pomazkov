import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { MyContext } from "../types.js";

export const menu = async (ctx: CallbackQueryContext<MyContext>) => {
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
};
