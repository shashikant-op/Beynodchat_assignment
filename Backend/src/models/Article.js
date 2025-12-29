const mongoose = require("mongoose");


const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    aititle: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    heroImage: {
      type: String,
    },
    contentImages: {
  type: [String], 
  default: [],
},

   //original article
    contentBlocks: {
      type: String,
      required: true,
    },

    //updated article
    aiContentBlocks:{
      type: String,
      default: "",
    },

    sourceUrl: {
      type: String,
      required: true,
    },
    referenceUrl: {
  type: [String], 
  default: [],
},
    isUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
