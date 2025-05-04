import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the User interface
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

// Define the User document interface
export interface IUserDocument extends IUser, Document {}

// Define the User model interface
export interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here if needed
}

// Define the User schema
const userSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
userSchema.methods.generateToken = function (): string {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" },
  );
};

// Create and export the User model
const User =
  mongoose.models.User ||
  mongoose.model<IUserDocument, IUserModel>("User", userSchema);
export { User };
