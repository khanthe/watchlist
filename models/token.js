const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true }
});


module.exports = mongoose.model("tokens", tokenSchema);