import express from 'express';
import { asyncHandler } from '../../common/express';
import * as memoController from './controller';

const router = express.Router();
router.get('/', asyncHandler(memoController.getMemos));
router.post('/', asyncHandler(memoController.createMemo));
router.post('/delete', asyncHandler(memoController.deleteMemo));
router.post('/run', asyncHandler(memoController.runSampleJob));

export default router;
