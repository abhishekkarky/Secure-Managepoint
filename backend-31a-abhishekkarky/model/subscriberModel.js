const mongoose = require("mongoose");

const getCurrentDate = () => {
  return new Date();
};

const subscriberSchema = mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: false,
      default: getCurrentDate(),
    },
    isSubscribed: {
      type: Boolean,
      required: false,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true, // Ensure that the user who adds the subscriber is always recorded
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("subscriber", subscriberSchema);
module.exports = Subscriber;
