const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dateFormat = require('dateformat');
const moment = require('moment')

var CommentSchema = require('../models/comment').schema;

var PostSchema = new Schema({
    title: { type: String, required: true, index: true },
    description: { type: String },
    body: { type: String, required: true, exclude: true, allowOnUpdate: false },
    author: { type: String, default: 'Anonymus' },
    comments: [{ type: CommentSchema, ref: 'Comment'}]
}, {timestamps: true});

PostSchema.virtual("publishedAt").get(function() {
    return dateFormat(this.createdAt, "ddd, mmm dS, yyyy");
});
  
PostSchema.virtual("publishedSince").get(function() {
    return moment(this.createdAt).fromNow()
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;