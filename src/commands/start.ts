import { InlineKeyboard } from "grammy";
import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const start = async (ctx: MyContext) => {
  if (!ctx.from) {
    return ctx.reply("User info is not availbale");
  }

  const { id, first_name, username } = ctx.from;
  try {
    const keyBoard = new InlineKeyboard().text("Меню", "menu");
    const existingUser = await User.findOne({ telegramId: id });
    if (existingUser) {
      return ctx.reply(`${existingUser.userName} Ви вже зареєстровані`, {
        reply_markup: keyBoard,
      });
    }
    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      userName: username,
    });
    await newUser.save();

    return ctx.reply(`${newUser.userName} ви зарєструвались в системі`, {
      reply_markup: keyBoard,
    });
  } catch (error) {
    console.error("Помилка реєстрації користувача", error);
    ctx.reply("Реєстрація не відбулась, спробуйте пізніше");
  }
};
