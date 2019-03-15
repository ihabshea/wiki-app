const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./Article');
const Language = require('./Language');
const Field = require('./Field');
const modfiicationSchema = new Schema({
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
module.exports = mongoose.model('Modification', modfiicationSchema);
/*
user: person!
article: article!
section: section
field: field!
languaugeg: language!
explanation: String!
date: String!
*/
