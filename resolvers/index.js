const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Article = require('../models/Article');
const Description = require('../models/Description');
const Field = require('../models/Field');
const Language = require('../models/Language');
const Modification = require('../models/Modification');
const Title = require('../models/Title');
const Section = require('../models/Section');
const User = require('../models/User');
module.exports = {
 articles: async () => {
   return Article.find().then(articles => {
     return articles.map(article => {
       return {...article._doc};
     });
   });
 },
 article: async ({id}) => {
   return Article.findOne({_id: mongoose.types.ObjectId(id)}).then(
     article => {
       return {...article._doc};
     }
   )
 },
 sections: async({articleId, language}) => {
    const clanguage = Language.findOne({shorthand: language});
   return Section.find({article: mongoose.types.ObjectId(articleId), language: clanguage.shorthand}).then(
     (sections) => {
       return sections.map(section => {
         return {...section._doc};
       });
     });
 },
 section: async({sectionId, language}) => {
    const clanguage = Language.findOne({shorthand: language});
   return Section.findOne({_id: mongoose.types.ObjectId(sectionId), language: clanguage.shorthand}).then(
     (section) => {
       return {...section._doc};
     }
   )
 },
 users: async() => {
   return User.find().then(
     (persons) => {
      return persons.map((person) => {
         return {...person._doc};
       });
     }
   )
 },
 fields: async({articleId, language}) => {
    const clanguage = Language.findOne({shorthand: language});
   return Field.find({article: mongoose.types.ObjectId(articleId), language: clanguage.shorthand}).then(
     (fields) => {
       return fields.map(field => {
         return {...field._doc};
       });
     });
 },
 field: async({fieldId, language}) => {
    const clanguage = Language.findOne({shorthand: language});
   return Field.findOne({_id: mongoose.types.ObjectId(fieldId), language: clanguage.shorthand}).then(
     (field) => {
       return {...field._doc};
     }
   )
 },
 title: async({articleId, language}) => {
   const clanguage = Language.findOne({shorthand: language});
   return Title.findOne({article: articleId, language: clanguage.shorthand}).then(
     (title) => {
       return {...title._doc};
     }
   )
 },
 description: async({articleId, language}) => {
   const clanguage = Language.findOne({shorthand: language});
   return Description.findOne({article: articleId, language: clanguage.shorthand}).then(
     (description) => {
       return {...description._doc};
     }
   )
 },
 language: async({language}) => {
   await Language.findOne({shorthand: language}).then(
     (rlanguage) => {
       return {...rlanguage._doc};
   })
 },
 languages: async() => {
   return Language.find().then(
     (rlanguages) => {
       return rlanguages.map((rlanguage) => {
         return {...rlanguage._doc};
       });
   });
 },
 modifications: async({articleId, language}) => {
    const clanguage = Language.findOne({shorthand: language});
   return Modification.find({article: mongoose.types.ObjectId(articleId), language: clanguage.shorthand}).then(
     (modifications) => {
       return modifications.map(modification => {
         return {...modiification._doc};
       });
     });
 },
 registerUser: async(args) => {
   var cryptPassword  = await  bcrypt.hashSync(args.userInput.password, 12);
   const user = new User({
  name: args.userInput.name,
   email: args.userInput.email,
   password: cryptPassword,
   registrationDate: args.userInput.registrationDate,
   username: args.userInput.username
 });
 return user.save().then(
   (res) => {
     return {...res._doc};
   }
 ).catch(err => {
   throw err;
 });

 }
};
//Bind users to related queries
