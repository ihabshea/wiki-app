const  express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const wikiSchema = require('./schema/index');
const wikiResolver = require('./resolvers/index');
const app = express();


app.use('/graphql', graphqlHttp({
   schema: wikiSchema,
   rootValue: wikiResolver,
   graphiql: true
}));
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ihabs-cluster-2l90n.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
).then().catch(err => {
  console.log(err);
}).then( () => {
    app.listen(9000);
});
