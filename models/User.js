const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./Article');
const Modification = require('./Modification')
const userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }],
  modifications: [{
    type: Schema.Types.ObjectId,
    ref: 'Modification'
  }]
});
module.exports = mongoose.model('User', userSchema);
