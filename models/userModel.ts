import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import { UserInterface } from "../general-types";
import { ValidateEmail } from "../utils/validations";
import checkEmail from "../utils/checkEmail";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "User must have a first name"],
      trim: true,
      minlength: [2, "Name cannot be less than 2 characters"],
      maxlength: [20, "Name cannot be more than 20 characters"],
    },
    lastName: {
      type: String,
      required: [true, "User must have a last name"],
      trim: true,
      minlength: [2, "Name cannot be less than 2 characters"],
      maxlength: [20, "Name cannot be more than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "The email already exists"],
      validate: {
        validator: function (email: string) {
          return checkEmail(email);
        },
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password cannot be less than 6 characters"],
      trim: true,
      select: false,
    },
    blogCount: {
      type: Number,
      default: 0,
    },
    hits: {
      type: Number,
      default: 0,
    },
    refreshToken: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (this: UserInterface, next) {
  // ensures password was modified before it runs
  if (!this.isModified("password")) return next();
  // hashes the password
  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

UserSchema.pre("save", function (this: UserInterface, next) {
  // Sets password changed at field in theUser collection
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance Method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
  UserPassword: string
) {
  return await bcrypt.compare(candidatePassword, UserPassword);
};

// models.User prevents unnecessary re-instatiation of User model
// const User = model<UserInterface>("User", UserSchema);
const User = models.User || (model("User", UserSchema) as any);
export default User;
