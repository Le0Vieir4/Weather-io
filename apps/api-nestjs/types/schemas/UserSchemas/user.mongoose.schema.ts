import { Schema, HydratedDocument } from 'mongoose';

export type User = {
  name?: string;
  email: string;
  password: string;
};
export type UserDocument = HydratedDocument<User>;
export const UserMongooseSchema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
