const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: false },
  year: { type: Number, required: true },
  runtime: { type: Number, required: false }, 
  rating: { type: Number, required: false },
  watched: { type: Boolean, required: true },
});

watchlistSchema.index({ title: 'text', description: 'text', genre: 'text' });

module.exports = mongoose.model("watchlist", watchlistSchema);
