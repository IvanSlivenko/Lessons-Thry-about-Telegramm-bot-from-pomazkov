import { products } from "./../consts/products";
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

  ctx.callbackQuery.message?.editText(`Ви обрали товар ${product.name}`);
};
