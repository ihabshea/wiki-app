const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Modification = require('./User');
const Article = require('./Article');
const sectionSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  createdOn: {
    type: String,
    required: true
  },
  title:{
    type: String,
    ref: 'user'
  },
  modifiers:
  [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  modifications:
  [{
    type: Schema.Types.ObjectId,
    ref: 'Modification'
  }]
});
module.exports = mongoose.model('Section', sectionSchema);
/*
author: person!
language: supportedLanguages!
title: String!
content: String!
createdOn: String!
lastModification: String!
*/
