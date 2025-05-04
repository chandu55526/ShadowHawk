import mongoose, { Document, Model } from "mongoose";
export interface IUser {
    email: string;
    password: string;
    name: string;
    role: "user" | "admin";
    lastLogin: Date;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
}
export interface IUserDocument extends IUser, Document {
}
export interface IUserModel extends Model<IUserDocument> {
}
declare const User: mongoose.Model<any, {}, {}, {}, any, any>;
export { User };
