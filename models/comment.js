const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require('moment')

// create a schema
const CommentSchema = new Schema({
    name: { type: String, trim: true, index: true },
    email: { type: String, trim: true, required: true },
    message: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now }
});


CommentSchema.virtual("commentAddedSince").get(function() {
    return moment(this.createdAt).fromNow()
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;