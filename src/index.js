import app from './server'
import { setupMiddleware } from '@middlewares'
import { graphQLRouter, restRouter } from './routers'
import http from 'http'
import connectDB from '../config/db'
const port = process.env.PORT || 4000
let currentApp = app

/* ----------------------------- DATABASE SETUP ----------------------------- */

connectDB({ useNewUrlParser: true })

/* ---------------------------- MIDDLEWARE SETUP ---------------------------- */

setupMiddleware(app)

app.use(restRouter)

/* ------------------------------ GRAPHQL SETUP ----------------------------- */

graphQLRouter.applyMiddleware({ app })
const server = http.createServer(app)
graphQLRouter.installSubscriptionHandlers(server)

/* ------------------------------ SERVER SERVE ------------------------------ */

server.listen(port, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${graphQLRouter.graphqlPath}`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${graphQLRouter.subscriptionsPath}`
  )
  console.log(' server is connected', port)
})

/* ------------------------------- HMR ENABLE ------------------------------- */

if (module.hot) {
  module.hot.accept(['./server'], () => {
    server.removeListener('request', currentApp)
    server.on('request', app)
    currentApp = app
  })
}
