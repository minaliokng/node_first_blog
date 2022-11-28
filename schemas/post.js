const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Posts", postSchema);