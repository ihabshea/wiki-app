const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./Article');
const Language = require('./Language');
const descrtiptionSchema = new Schema({
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
  },
  lastModification: {
    type: String,
    require: true
  }
});
module.exports = mongoose.model('Description', descrtiptionSchema);
/*
_id: ID!
article: article!
text: String!
lastModification: String!
modifications: [modification!]
language: supportedLanguages!
*/
