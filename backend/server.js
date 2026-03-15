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

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        hasKey: !!process.env.GEMINI_API_KEY,
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected'
    });
});

app.get('/', (req, res) => res.json({ status: 'online', service: 'PromptCraft Engine' }));

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', promptRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/templates', templateRoutes);

// Error formatting
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ error: err.message || 'Something broke!' });
});

// Database connection (Non-blocking)
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => console.log('✅ MongoDB Connected'))
      .catch(err => console.error('❌ MongoDB Error:', err.message));
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ENGINE v6.0 LIVE ON PORT ${PORT}`);
});
