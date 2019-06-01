import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";
import { User, UserDocument } from "../models/User";
export type EssayDocument = mongoose.Document & {
  email: string,
  title: string,
  tag: Array<string>,
  author: UserDocument
  time: Date,
  isMarkdown: Boolean,
  content: string,
  love: number,
  read: number,
  isDraft: Boolean,
  isDelete: Boolean,
};

const essaySchema = new mongoose.Schema({
  email: { type: String, required: true },
  title: { type: String, required: true },
  tag: { type: String },
  author: { type: Object },
  time: Date,
  isMarkdown: Boolean,
  content: { type: String, required: true },
  love: Number,
  read: Number,
  isDraft: Boolean,
  isDelete: Boolean,
});



export const Essay = mongoose.model<EssayDocument>("Essay", essaySchema);
