const { buildSchema } = require('graphql');
module.exports =
buildSchema(`
  type article{
    _id: ID!
    titles: [title!]!
    descriptions: [description!]!
    createdOn: String!
    modifiedOn: String!
    creator: person!
    sections: [section!]
    languages:  [supportedLanguages!]!
    fields: [field!]
    modifiers: [person!]
    modifications: [modification!]
  }
  type person{
    _id: ID!
    name: String!
    registrationDate: String!
    email: String!
    username: String!
    articles: [article!]
    modifications: [modification!]
  }
  type modification{
    _id: ID!
    user: person!
    article: article!
    section: section
    field: field
    explanation: String!
    language: supportedLanguages!
    date: String!
  }
  type section {
    _id: ID!
    author: person!
    language: supportedLanguages!
    title: String!
    content: String!
    createdOn: String!
    lastModification: String!
    modifiers: [person!]
    modifications: [modification!]
  }
  type field {
    _id: ID!
    author: person!
    article: article!
    language: supportedLanguages!
    name: String!
    order: Int!
    lastModification: String!
    modifications: [modification!]
    value: String!
  }
  type title{
    _id: ID!
    article: article!
    text: String!
    language: supportedLanguages!
  }
  type description{
    _id: ID!
    article: article!
    text: String!
    lastModification: String!
    modifications: [modification!]
    language: supportedLanguages!
  }
  type supportedLanguages{
    _id: ID!
    name: String!
    shorthand: String!
  }
  type AuthData{
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
  input UserInput{
    username: String!
    password: String!
    email: String!
    name: String!
    registrationDate: String!
  }

  input TitleInput{
    title: String!
    articleId: ID!
    language: String!
  }
  input DescriptionInput{
    articleId : ID!
    text: String!
    language: String!
  }
  input SectionInput{
    title: String!
    text: String!
    language: String!
    articleId: ID!
  }
  type RootMutation{
    registerUser(userInput: UserInput): person!
    createArticle: article!
    createDescription(descriptionInput: DescriptionInput): description!
    createTitle(titleInpt: TitleInput): title!
    createSection(sectionInput: SectionInput): section!
    createLanguage(name: String, shorthand: String): supportedLanguages!
  }
  type RootQuery{
    articles(language: String!): [article!]!
    article(id: ID!, language: String!): article!
    users: [person!]
    sections(articleID: ID!,language: String!): [section!]!
    section(sectionID: ID!,language: String!): section!
    fields(articleID: ID!,language: String!): [field!]!
    field(articleID: ID!,language: String!): field!
    title(articleID: ID!, language: String!): title
    description(articleID: ID!, language: String!): description
    language(shorthand: String!): supportedLanguages!
    languages: [supportedLanguages!]!
    alanguages(aid: ID!):  [supportedLanguages!]
    modifications(articleID: ID!,language: String!): [modification!]!
    login(username: String!, password: String!): AuthData!
    topArticles(limit: Int!): [article!]!
  }
  schema{
    query: RootQuery,
    mutation: RootMutation
  }
  `);
