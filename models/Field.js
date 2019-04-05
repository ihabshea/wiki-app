const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Modification = require('./User');
const Article = require('./Article');
const Object = require('./Object');
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
  objects: [{
    type: Schema.Types.ObjectId,
    ref: "Object"
  }],
  special: {
    type: Boolean,
    require: false
  },
  date: {
    type: Boolean,
    require: false
  },
  articleRef:{
    type: Schema.Types.ObjectId,
    ref:  "Article"
  },
  name: {
    type: String,
    require: true
  },
  value:{
    type: String,
    require: true
  },
  type: {
    type: String,
    require: false
  },
  order: {
    type: Number,
    required: false
  },
  articlesRef: [{
    type: Schema.Types.ObjectId,
    ref:  "Article"
  }],
  relatedDates: [{
    type: String,
    required: false
  }],
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
