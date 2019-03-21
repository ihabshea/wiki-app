const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./Article');
const Language = require('./Language');
const USe = require('./User');
const Field = require('./Field');
const modfiicationSchema = new Schema({
  explanation: {
    type: String,
    require: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section'
  },
  delete:{
    type: Boolean,
    require: false
  },
  create:{
    type: Boolean,
    require: false
  },
  deleteType:{
    type: String,
    require: false
  },
  field: {
    type: Schema.Types.ObjectId,
    ref: 'Field'
  },
  fieldPName: {
    type: String,
    require: false
  },
  fieldPValue: {
    type: String,
    require: false
  },
  sectionPName: {
    type: String,
    require: false
  },
  sectionCName: {
    type: String,
    require: false
  },
  sectionPText: {
    type: String,
    require: false
  },
  sectionNText: {
    type: String,
    require: false
  },
  fieldNValue: {
    type: String,
    require: false
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
