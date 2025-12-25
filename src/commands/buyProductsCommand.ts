import { products } from "../consts/products.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { MyContext } from "../types.js";

export const buyProducts = async (ctx: CallbackQueryContext<MyContext>) => {
  await ctx.answerCallbackQuery();

  const productId = ctx.callbackQuery.data.split("-")[1];
  const product = products.find(
    (product) => product.id === parseInt(productId)
  );
  if (!product) {
    return ctx.callbackQuery.message?.editText("Продукт не знайдено");
  }

  await ctx.callbackQuery.message?.editText(
    `Ви обрали товар: \n
     ${product.name}\n
     Ціна: ${product.price} грн.\n
     
     `,
    {
      reply_markup: new InlineKeyboard().text("<-- Повернутись", "backToMenu"),
    }
  );
};
