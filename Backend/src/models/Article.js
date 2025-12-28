const mongoose = require("mongoose");

const contentBlockSchema = new mongoose.Schema(
  {
    blockType: {
      type: String,
      enum: ["paragraph", "heading", "image", "list"],
      required: true,
    },

    text: {
      type: String, 
    },

    src: {
      type: String, 
    },

    listItems: {
      type: [String], 
    },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    heroImage: {
      type: String,
    },

   //original article
    contentBlocks: [contentBlockSchema],

    //updated article
    aiContentBlocks: [contentBlockSchema],

    sourceUrl: {
      type: String,
      required: true,
    },
    referenceUrl: {
      type: String,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
