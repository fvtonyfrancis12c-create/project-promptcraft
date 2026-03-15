import express from 'express';
import PromptHistory from '../models/PromptHistory.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper to check if DB is connected
const checkDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected. History feature is temporarily offline." });
  }
  next();
};

router.post('/', checkDB, async (req, res) => {
  try {
    const { promptText, aiResponse, toolUsed } = req.body;
    const historyItem = new PromptHistory({ promptText, aiResponse, toolUsed });
    await historyItem.save();
    res.status(201).json(historyItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]); // Return empty array if DB is down
    }
    const history = await PromptHistory.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', checkDB, async (req, res) => {
  try {
    await PromptHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'History item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
