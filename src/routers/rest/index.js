/* -------------------------------------------------------------------------- */
/*                                 REST ROUTER                                */
/* -------------------------------------------------------------------------- */

import express from 'express'
import { userRouter } from '@modules/User'

export const restRouter = express.Router()

restRouter.use('/', userRouter)
