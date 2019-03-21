const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Modification = require('./User');
const Article = require('./Article');
const Language = require('./Language');
const fieldSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: 'Language'
  },
  name: {
    type: String,
    required: true
  },
  value:{
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: false
  },
  lastModification:{
    type: String,
    required: true
  },
  modifications:
  [{
    type: Schema.Types.ObjectId,
    ref: 'Modification'
  }]
});
module.exports = mongoose.model('Field', fieldSchema);
/*
author: person!
language: supportedLanguages!
name: String!
order: Int!
lastModification: String!
modifications: [modification!]
value: String!
*/
