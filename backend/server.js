import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import historyRoutes from './routes/history.route.js';
import promptRoutes from './routes/api.route.js';
import templateRoutes from './routes/template.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('--- BACKEND STARTUP SEQUENCE INITIATED ---');
console.log(`Node version: ${process.version}`);

process.on('uncaughtException', (err) => {
  console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL UNHANDLED REJECTION:', reason);
});

// Health check
app.get('/health', (req, res) => res.status(200).send('API OK'));
app.get('/', (req, res) => res.json({ status: 'online' }));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', promptRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/templates', templateRoutes);

// Error formatting middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ error: err.message || 'Something broke on the server!' });
});

// Database connection (Disabled for debugging)
/*
console.log('Attempting MongoDB connection...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/promptcraft', {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Running in offline mode (History will be disabled)');
  });
*/

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PROMPTCRAFT ENGINE v5.0 LIVE ON PORT ${PORT}`);
    console.log('--- Production Mode Active (Global Binding) ---');
});
