const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    titles: [{
        type: Schema.Types.ObjectId,
        ref: 'Title'
    }],
    type:{
        type: String,
        require: true
    },
    descriptions: [{
        type: Schema.Types.ObjectId,
        ref: 'Description'
    }],
    languages: [{
        type: Schema.Types.ObjectId,
        ref: 'Language'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
module.exports = mongoose.model('Category', categorySchema);