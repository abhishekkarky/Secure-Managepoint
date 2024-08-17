const mongoose = require("mongoose");

const broadcastSchema = mongoose.Schema(
  {
    broadcastTitle: {
      type: String,
      required: true,
      trim: true,
    },
    broadcastTo: {
      type: String,
      enum: ['tag', 'segment', 'product', 'all sub'],
      required: true,
    },
    broadcastGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
      required: false,
    },
    broadcastTime: {
      type: Date,
      required: false,
    },
    broadcastDescription: {
      type: String,
      required: true,
      trim: true,
    },
    broadcastStatus: {
      type: String,
      enum: ['active', 'inactive'],
      required: false,
    },
    broadcastVisibility: {
      type: String,
      enum: ['public', 'private'],
      required: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sendTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "subscriber" }],
  },
  { timestamps: true }
);

const Broadcast = mongoose.model("broadcast", broadcastSchema);
module.exports = Broadcast;
