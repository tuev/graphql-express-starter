import bodyParser from 'body-parser'
import requireAuthorization from './requireAuthorization'
import methodOverride from 'method-override'
import cors from 'cors'
export { requireAuthorization }

export const setupMiddleware = app => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(methodOverride())
  app.use(cors())

  app.use('*', (req, res, next) => {
    const query = req.query.query || req.body.query || ''
    if (query.length > 2000) {
      throw new Error('Query too large')
    }
    next()
  })

  app.all('*', function (req, res, next) {
    var origin = req.get('origin')
    res.header('Access-Control-Allow-Origin', origin)
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, GET, POST, DELETE, OPTIONS'
    )
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    next()
  })
}
