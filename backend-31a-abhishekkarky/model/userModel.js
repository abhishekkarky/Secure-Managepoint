const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userImageUrl: {
      type: String,
      required: false,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true, // Remove leading and trailing spaces
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensure unique email addresses
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    number: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: false,
    },
    otpTimestamp: {
      type: Date,
      default: Date.now, // Store as a date object
      required: false,
    },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscriber",
      },
    ],
    growth: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
