import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
    role: "user" | "admin";
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
