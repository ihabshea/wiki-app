const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Article = require('../models/Article');
const Description = require('../models/Description');
const Field = require('../models/Field');
const Language = require('../models/Language');
const Modification = require('../models/Modification');
const Title = require('../models/Title');
const Section = require('../models/Section');
const User = require('../models/User');

const section = ({articleID, slanguage}) => {
  return Section.find({article: mongoose.Types.ObjectId(articleID), language: slanguage}).then(
    (res) => {
      return res.map(
        (section) => {
          return {...section._doc};
        }
      )
    }
  );
}
const modification = ({articleID, slanguage}) => {
  return Modification.find({article: mongoose.Types.ObjectId(articleID), language: slanguage}).then(
    (res) => {
      return res.map(
        (modification) => {
          return {...modification._doc};
        }
      )
    }
  );
}
const article = ({personID, language}) => {
  return article.find({creator: mongoose.Types.ObjectId(personID)}).then(
    (res) => {
      return res.map(
        (article) => {
          return {...article._doc,
                  title: title.bind(this, article._doc._id, language)
          };
        }
      )
    }
  );
}
const field = ({articleID, slanguage}) => {
  return Field.find({article: mongoose.Types.ObjectId(articleID), language: slanguage}).then(
    (res) => {
      return res.map(
        (field) => {
          return {...field._doc};
        }
      )
    }
  );
}
const title = ({articleId, slanguage}) => {
  return Title.findOne({article: mongoose.Types.ObjectId(articleID), language: slanguage}).then(
    (res) => {
      return {...res._doc};
    }
  )
}
const description = ({articleId, slanguage}) => {
  return Description.findOne({article: mongoose.Types.ObjectId(articleID), language: slanguage}).then(
    (res) => {
      return {...res._doc};
    }
  )
}
module.exports = {
 articles: async ({language}) => {
   return Article.find().then(articles => {
     return articles.map(article => {
       return {...article._doc,
         title: title.bind(this, article._doc._id, language)
       };
     });
   });
 },
 article: async ({id,language}) => {
   return Article.findOne({_id: mongoose.types.ObjectId(id)}).then(
     article => {
       return {...article._doc,
         sections: section.bind(this, article._doc._id, language),
         title: title.bind(this, article._doc._id, language),
         descripition: description.bind(this, article._doc._id, language),
         fields: field.bind(this, article._doc._id, language),
         modifications: modification.bind(this, article._doc._id, language)
       };
     }
   )
 },
 topArticles: async({limit, language}) => {
    return Article.find().sort({visits:1}).limit(3).then(
      articles => {
        articles.map(article =>  {
          return {...article._doc,
            title: title.bind(this, article._doc._id, language)
          };
        });
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
 users: async({language}) => {
   return User.find().then(
     (persons) => {
      return persons.map((person) => {
         return {...person._doc,
           articles: article.bind(this, person._doc._id, language)
         };
       });
     }
   )
 },
 fields: async({articleID, language}) => {
    const clanguage = await Language.findOne({shorthand: language}).exec();
   return Field.find({article: articleID, language: clanguage._id}).then(
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
 title: async({articleID, language}) => {
   const clanguage = await Language.findOne({shorthand: language}).exec();
   console.log(clanguage._id, articleID);
   const title =  await Title.findOne({article: articleID, language: clanguage._id}).exec();
   console.log(title);
   return title;

 },
 description: async({articleID, language}) => {
   const clanguage = await Language.findOne({shorthand: language}).exec();
   const description = await Description.findOne({article: articleID, language: clanguage._id}).exec();
   return description;
 },
 language: async({language}) => {
   const rlanguage = await Language.findOne({shorthand: language}).exec();
   return rlanguage;
 },
 languages: async() => {
   return Language.find().then(
     (rlanguages) => {
       return rlanguages.map((rlanguage) => {
         return {...rlanguage._doc};
       });
   });
 },
 alanguages: async({aid}) => {
  const article = await Article.findOne({_id: aid}).exec();
  console.log(article.languages);
   return Language.find({_id: {$in: article.languages}}).then(
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
 }

);
 return user.save().then(
   (res) => {
     return {...res._doc};
   }
 ).catch(err => {
   throw err;
 });

},
login: async({username, password}) => {
  const user = await User.findOne({username:  username});
  if(!user){
    throw new Error('Invalid credentials');
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if(!validPassword){
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({userId: user._id, username: user.username}, 'binrlbvdc', {
    expiresIn: '24h'
  });
  return {
    userId: user._id,
    token: token,
    tokenExpiration: 24
  }

},
createArticle: async(args, req) => {
  if(!req.isAuthorized){
    throw new Error("Articles have to be created by users.")
  }
  const article = new Article({
    createdOn: new Date().toISOString(),
    modifiedOn: new Date().toISOString(),
    creator: req.userId,
    views: 0
  });
  const result = await article.save();
  return {...result._doc};
},
createLanguage: async({name, shorthand}) => {
  const language = new Language({
    name:  name,
    shorthand: shorthand
  });
  const result = await language.save();
  return {...result._doc};
},
createTitle: async(args, req) => {
  if(!req.isAuthorized) {
    throw new Error("Articles have to be created by users.")
  }
  const article = await Article.findOne({_id: args.titleInpt.articleId});
  if(!article){
    throw new Error("Invalid article");
  }
  const fLanguage = await Language.findOne({shorthand: args.titleInpt.language});
  if(!fLanguage){
    throw new Error("Invalid languauge");
  }
  article.languages.push(fLanguage._id);
  await article.save();
  const title = await Title({
    text: args.titleInpt.title,
    language: fLanguage._id,
    article: article._id,
  });
  const result = await title.save();
  return {...result._doc};
},
createDescription: async(args, req) => {
  if(!req.isAuthorized) {
    throw new Error("Articles have to be created by users.")
  }
  const article = await Article.findOne({_id: args.descriptionInput.articleId});
  if(!article){
    throw new Error("Invalid article");
  }
  const fLanguage = await Language.findOne({shorthand: args.descriptionInput.language});
  if(!fLanguage){
    throw new Error("Invalid languauge");
  }
  article.languages.push(fLanguage._id);
  await article.save();
  const description = await Description({
    text: args.descriptionInput.text,
    language: fLanguage._id,
    article: article._id,
    lastModification: new Date().toISOString()
  });
  const result = await description.save();
  return {...result._doc};
},
deleteField: async(args, req) => {
  if(!req.isAuthorized){
    throw new Error("You have to be logged in.")
  }
  const field  = await Field.findOne({_id: args.fieldID}).exec();
  const article = await Article.findOne({_id: field.article}).exec();
  if(!article){
    throw new Error("Invalid article");
  }
  const modification = await Modification({
    explanation: args.reason,
    article: article._id,
    user: req.userId,
    delete: true,
    deleteType: field,
    fieldPName: field.name,
    fieldPValue: field.value,
    lastModification: new Date().toISOString()
  });
  const deletetField = await Field.deleteOne({_id: field._id});
  const result = await modification.save();
  return result;
},
updateField: async(args, req) => {
  if(!req.isAuthorized){
    throw new Error("You have to be logged in.")
  }
  const field  = await Field.findOne({_id: args.fieldID}).exec();
  const article = await Article.findOne({_id: field.article}).exec();
  if(!article){
    throw new Error("Invalid article");
  }
  let pvalue = field.value;
  field.value = args.newvalue;
  const result = await field.save();
  const modification = await Modification({
    explanation: args.reason,
    user: req.userId,
    article: article._id,
    fieldPName: field.name,
    fieldPValue: pvalue,
    fieldNValueu: field.value,
    lastModification: new Date().toISOString()
  });
  // const deletetField = await Field.deleteOne({_id: field._id});
  await modification.save();
  return result;
},
createField: async(args, req) => {
  if(!req.isAuthorized) {
    throw new Error("Articles have to be created by users.")
  }
  const article = await Article.findOne({_id: args.fieldInput.articleId});
  if(!article){
    throw new Error("Invalid article");
  }
  const fLanguage = await Language.findOne({shorthand: args.fieldInput.language}).exec();
  if(!fLanguage){
    throw new Error("Invalid languauge");
  }
  article.languages.push(fLanguage._id);  
  await article.save();
  const field = await Field({
    author: req.userId,
    name: args.fieldInput.name,
    value:  args.fieldInput.value,
    language: fLanguage._id,
    article: article._id,
    lastModification: new Date().toISOString()
  });
  const result = await field.save();
  return {...result._doc};
},
updateDescription: async(args, req) => {
  if(!req.isAuthorized) {
    throw new Error("Articles have to be modified by users.")
  }
  const article = await Article.findOne({_id: args.descriptionInput.articleId});
  if(!article){
    throw new Error("Invalid article");
  }
  const fLanguage = await Language.findOne({shorthand: args.descriptionInput.language});
  if(!fLanguage){
    throw new Error("Invalid languauge");
  }

  const description = await Description.findOne({article: article._id, language:fLanguage._id}).exec();
  description.text = descriptionInput.text;
  await desciption.save();

  return desciption;
}
};
//Bind users to related queries
