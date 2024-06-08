import express from 'express';
import { asyncHandler } from '../../common/express';
import * as statsController from './controller';

const router = express.Router();

router.get('/', asyncHandler(statsController.getStats));

export default router;
