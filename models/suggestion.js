const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: false },
  year: { type: Number, required: true },
  runtime: { type: Number, required: false }, 
  rating: { type: Number, required: false },
  watched: { type: Boolean, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

module.exports = mongoose.model("suggestion", suggestionSchema);
