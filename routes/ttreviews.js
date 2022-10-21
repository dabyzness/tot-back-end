import { Router } from 'express'
import * as ttreviewCtrl from '../controllers/ttreviews.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/


export { router }