import { Router } from 'express'
import * as restaurantCtrl from '../controllers/restaurants.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/

export { router }