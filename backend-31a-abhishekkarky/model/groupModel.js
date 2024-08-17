const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove leading and trailing spaces
    },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "subscriber" }],
    groupType: {
      type: String,
      enum: ['type1', 'type2', 'type3'], // Replace with actual types
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true, // Ensure that the user who adds the group is always recorded
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("group", groupSchema);
module.exports = Group;
