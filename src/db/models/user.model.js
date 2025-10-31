import { Schema, model } from "mongoose";
import { defaultImage, roles } from "../../utils/global-variables.js";


const userSchema = new Schema(
  {
    first_name: { type: String, required: [true, "first name is required"] },
    last_name: { type: String, required: [true, "last name is required"] },
    email: {
      type: String,
      unique: [true, "email already exits"],
      required: [true, "email is required"],
    },
    password: { type: String, required: [true, "password is required "] },
    age: { type: Number, required: [true, "age is required "] },
    address: { type: String, required: false },
    phone: { type: String, required: [true, "phone is required "] },
    isConfirmed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: 0 },
    image: {
      secure_url: { type: String , default : defaultImage.secure_url},
      public_id: { type: String , default : defaultImage.public_id},
    },
    role: {
      type: String,
      enum: [ roles.USER , roles.ADMIN],
      default: roles.USER,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.virtual("userName").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

export const User = model("users", userSchema);
