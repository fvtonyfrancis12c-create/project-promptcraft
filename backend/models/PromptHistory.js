import mongoose from 'mongoose';

const promptHistorySchema = new mongoose.Schema({
  promptText: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  toolUsed: {
    type: String,
    required: true,
    enum: ['generator', 'improver', 'analyzer', 'image', 'chat', 'optimizer', 'compare', 'playground']
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model('PromptHistory', promptHistorySchema);
