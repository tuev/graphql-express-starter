/* -------------------------------------------------------------------------- */
/*                                 REST ROUTER                                */
/* -------------------------------------------------------------------------- */

import express from 'express'
import { apiErrorHandler } from '@utils/errorHandler'
import { userRouter } from '@modules/User'
import { eventRouter, eventRestifyRouter } from '@modules/Event'

export const restRouter = express.Router()

restRouter.use('/', [userRouter, eventRestifyRouter])
restRouter.use('/api/v1/mock', eventRouter)

restRouter.use(apiErrorHandler)
