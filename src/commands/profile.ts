import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const profile = async (ctx: CallbackQueryContext<MyContext>) => {
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
};
