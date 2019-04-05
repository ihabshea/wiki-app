const  express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const wikiSchema = require('./schema/index');
const wikiResolver = require('./resolvers/index');
const app = express();

const isauthorized = require('./requestHandler/isauthorized');
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method === 'OPTIONS' ){
    return res.sendStatus(200);
  }
  next();
});
app.use(isauthorized);

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
