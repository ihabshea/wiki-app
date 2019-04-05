const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Field = require('./Field');
const Article = require('./Article');

const objectSchema = new Schema({
    value: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    field: {
        type:  Schema.Types.ObjectId,
        ref: 'Field'
    },
    refArticle: { 
        type: Schema.Types.ObjectId,
        ref: 'Artice'
    }
});
module.exports = mongoose.model('Object', objectSchema);