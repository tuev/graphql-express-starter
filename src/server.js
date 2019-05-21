import express from 'express'
// import { setupMiddleware } from '@middlewares'
// import { graphQLRouter } from './api'

const app = express()

// setupMiddleware(app)

// graphql route
// graphQLRouter.applyMiddleware({ app })

app.use(express.static(__dirname + '/dist/server.js'))

// catch all
app.all('*', (req, res) => {
  res.json({ ok: true })
})

export default app
