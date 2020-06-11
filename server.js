const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql/Post.js');
const postService = require('./src/service/PostService');
const PORT = process.env.PORT || 4000;
// Create an express server and a GraphQL endpoint
const app = express();

const cors = require('cors')
app.use(cors())

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            postService: new postService()
        };
    },
    path: '/graphql'
});
server.applyMiddleware({ app });
app.get('/playground',
    expressPlayground({
        endpoint: '/graphql'
    })
);
app.listen({ port: PORT }, () => {
    console.log('Server listening on port 4000')
});

const costAnalysis = require('graphql-cost-analysis').default
const costAnalyzer = costAnalysis({
    maximumCost: 1000,
  })
  
const graphqlExpress = require('express');
app.use(
  '/graphql',
  graphqlExpress(req => {
    return {
      schema,
      rootValue: null,
      validationRules: [
        costAnalysis({
          variables: req.body.variables,
          maximumCost: 1000,
        }),
      ],
    }
  })
)

const createRateLimitRule = require('graphql-rate-limit').default
const shield = require('graphql-shield');

// Step 1: get rate limit shield instance rule
const rateLimitRule = createRateLimitRule({ identifyContext: (ctx) => ctx.id });

const permissions = shield({
  Query: {
    // Step 2: Apply the rate limit rule instance to the field with config
    getItems: new rateLimitRule({ window: "1s", max: 5 })
  }
});

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: gql`
      type Query {
        getItems: [Item]
      }
    `,
    resolvers: {
      Query: {
        getItems: () => [{ id: '1' }]
      }
    }
  }),
  permissions
)
