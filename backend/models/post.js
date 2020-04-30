const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
title: { type: String, require : true},
content: { type: String, require : true}
});

model.exports = mongoose.model('post', postSchema);
