import { products } from "./../consts/products";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { MyContext } from "../types.js";

export const productsCommand = async (ctx: CallbackQueryContext<MyContext>) => {
  await ctx.answerCallbackQuery();

  const productsList = products.reduce((acc, cur) => {
    return (
      acc +
      `- ${cur.name}\n Ціна: ${cur.price} грн.\n Опис: ${cur.description}\n`
    );
  }, "");

  const messageText = `Всі товари\n ${productsList}`;

  // -------------------------------------------------------- var 1
  // const keybordButtonRows = products.map((product) => {
  //   return InlineKeyboard.text(product.name, `buyProduct-${product.id}`);
  // });

  // const keyboard = InlineKeyboard.from([
  //   keybordButtonRows,
  //   [InlineKeyboard.text("<-- Повернутись", "backToMenu")],
  // ]);

  // ----------------------------------------------------------- var 2
  const keyboard = new InlineKeyboard();

  products.forEach((product) => {
    keyboard.text(product.name, `buyProduct-${product.id}`).row();
  });
  keyboard.text("<-- Повернутись", "backToMenu");

  await ctx.callbackQuery.message?.editText(messageText, {
    reply_markup: keyboard,
  });
};
