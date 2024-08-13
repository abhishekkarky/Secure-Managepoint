const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "subscriber" }],
    groupType: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const group = mongoose.model("group", groupSchema);
module.exports = group;
