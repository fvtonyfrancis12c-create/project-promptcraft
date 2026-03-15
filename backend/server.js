console.log('--- CRITICAL: SERVER STARTING ---');
import express from 'express';
console.log('--- Express imported ---');
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
console.log('--- Loading dotenv ---');
dotenv.config();
console.log('--- Dotenv loaded (Key present:', !!process.env.GEMINI_API_KEY, ') ---');

import historyRoutes from './routes/history.route.js';
import promptRoutes from './routes/api.route.js';
import templateRoutes from './routes/template.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Registering routes...');
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', hasKey: !!process.env.GEMINI_API_KEY }));
app.get('/', (req, res) => res.json({ status: 'online' }));

app.use(cors());
app.use(express.json());

app.use('/api', promptRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/templates', templateRoutes);

console.log('Starting listener on port', PORT);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ENGINE v7.0 LIVE ON PORT ${PORT}`);
});

// Async DB connection
if (process.env.MONGO_URI) {
    console.log('Starting DB connection...');
    mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => console.log('✅ MongoDB Connected'))
      .catch(err => console.error('❌ MongoDB Error:', err.message));
}
