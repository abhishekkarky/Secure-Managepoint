const mongoose = require("mongoose");

const getCurrentDate = () => {
  return new Date();
};

const subscriberSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("subscriber", subscriberSchema);
module.exports = Subscriber;
