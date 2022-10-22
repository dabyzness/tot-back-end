import { Router } from 'express';
import * as ttreviewCtrl from '../controllers/ttreviews.js';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';

const router = Router();

/*---------- Public Routes ----------*/
router.get('/', ttreviewCtrl.index);
router.get('/:id', ttreviewCtrl.show);

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);

router.post('/', checkAuth, ttreviewCtrl.create);
router.patch('/:id', checkAuth, ttreviewCtrl.update);
router.delete('/:id', checkAuth, ttreviewCtrl.delete);

export { router };
