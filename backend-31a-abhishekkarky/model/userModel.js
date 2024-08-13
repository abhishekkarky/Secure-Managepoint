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
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    number: {
      type: String,
      required: false,
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
      type: String,
      default: false,
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

const users = mongoose.model("users", userSchema);
module.exports = users;
