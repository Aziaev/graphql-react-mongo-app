const bodyParser = require('body-parser');
const express = require('express');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
const mongoose = require('mongoose');

// App
const app = express();

//DB
mongoose
    // .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@terrarium-uvtku.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .connect(`mongodb://localhost:27017`)
    .then(() => {
        console.log('app connected to DB');
        app.listen(4000);
    })
    .catch(err => {
        console.log(err)
    })

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));