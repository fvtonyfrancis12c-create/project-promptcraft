import express from 'express';
import { handleGenerate, handleImprove, handleAnalyze, handleImage, handleChat, handleOptimizer, handleCompare, handleSuggest } from '../controllers/promptController.js';

const router = express.Router();

router.post('/generate', handleGenerate);
router.post('/improve', handleImprove);
router.post('/analyze', handleAnalyze);
router.post('/image', handleImage);
router.post('/chat', handleChat);
router.post('/optimizer', handleOptimizer);
router.post('/compare', handleCompare);
router.post('/suggest', handleSuggest);

export default router;
