const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./Article');
const Language = require('./Language');
const titleSchema = new Schema({
  text: {
    type: String,
    require: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  language: {
    type: Schema.Types.ObjectId,
    ref:'Languauge'
  }
});
module.exports = mongoose.model('Title', titleSchema);
/*
_id: ID!
article: article!
text: String!
language: supportedLanguages!
*/
