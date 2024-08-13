const mongoose = require("mongoose");

const broadcastSchema = mongoose.Schema(
  {
    broadcastTitle: {
      type: String,
      required: true,
    },
    broadcastTo: {
      type: String, // tag, segment, product, all sub
      required: true,
    },
    broadcastGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
    },
    broadcastTime: {
      type: Date,
      required: false,
    },
    broadcastDescription: {
      type: String,
      required: true,
    },
    broadcastStatus: {
      type: String,
      required: false,
    },
    broadcastVisibility: {
      type: String,
      required: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    sendTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "subscriber" }],
  },
  { timestamps: true }
);

const broadcast = mongoose.model("broadcast", broadcastSchema);
module.exports = broadcast;
