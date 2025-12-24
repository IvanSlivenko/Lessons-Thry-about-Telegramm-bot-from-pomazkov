import { Document } from "mongoose";

interface IUser extends Document {
  telegramId: number;
  firstName: string;
  userName: string;
  createdAt: Date;
}
