const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./Article');
const Language = require('./Language');
const User = require('./User');
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
  createType: {
    type: String,
    require: false,
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
  fieldCName: {
    type: String,
    require: false
  },
  fieldPValue: {
    type: String,
    require: false
  },
  fieldCValue: {
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
  otitle: {
    type: String,
    require:false,
  },
  ntitle: {
    type: String,
    require: false
  },
  odescription:{
    type: String,
    require: false
  },
  ndescription: {
    type: String,
    requre: false
  },
  language: {
    type: Schema.Types.ObjectId,
    ref:'Languauge'
  },
  date: {
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
