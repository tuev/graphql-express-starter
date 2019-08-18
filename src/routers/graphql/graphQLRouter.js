import { ApolloServer } from 'apollo-server-express'
import resolvers from './graphql.resolver'
import schemaDirectives from '@directives'
import typeDefs from './graphql.typeDefs'
import { PubSub } from 'graphql-subscriptions'

// Pubsub can be replaced by some below method:
//  - Redis
// - Google PubSub
// - MQTT enabled broker
// - RabbitMQ
// - Kafka
// - Postgres
// - Google Cloud Firestore
// ref: https://www.apollographql.com/docs/apollo-server/features/subscriptions/#subscriptions-example
export const pubsub = new PubSub()

export const graphQLRouter = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: req => ({ ...req, pubsub }),
  // Ws Hook for subscription
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      // TODO: add authorization wsToken on connectionParams
      console.log('🚀 ws on connect')
    },
    onDisconnect: (webSocket, context) => {
      console.log('🚀 ws onDisconnect ')
    }
  }
})
