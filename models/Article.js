const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Section = require('./Section');
const Field = require('./Field')
const Modification = require('./Modification')
const Language = require('./Language');
const articleSchema = new Schema({
  createdOn: {
    type: String,
    required: true
  },
  modifiedOn: {
    type: String,
    required: true
  },
  languages: [{
    type: Schema.Types.ObjectId,
    ref: 'Language'
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  creator:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sections: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Section'
    }
  ],
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Field'
    }
  ],
  modifiers:
  [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  modifications:
  [
    {
      type: Schema.Types.ObjectId,
      ref: 'Modification'
    }
  ],
  views: {
    type: Number,
    required: true
  }
});
module.exports = mongoose.model('Article', articleSchema);
/*
_id: ID!
titles: [title!]
descriptions: [description!]
createdOn: String!
modifiedOn: String!
creator: person!
modifiers: [person!]
modifications: [modification!]
*/
