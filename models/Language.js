const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const languageSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  shorthand: {
    type: String,
    require: true
  }
});
module.exports = mongoose.model('Language', languageSchema);
/*
_id: ID!
article: article!
text: String!
language: supportedLanguages!
*/
