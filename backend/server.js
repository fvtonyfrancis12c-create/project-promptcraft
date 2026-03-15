import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import historyRoutes from './routes/history.route.js';
import promptRoutes from './routes/api.route.js';
import templateRoutes from './routes/template.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

console.log('--- PROMPTCRAFT PRODUCTION ENGINE STARTING ---');

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', hasKey: !!process.env.GEMINI_API_KEY, version: '9.0.FORCE' }));
app.get('/', (req, res) => res.json({ status: 'online', service: 'PromptCraft', version: '9.0.FORCE' }));

// Routes
app.use('/api', promptRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/templates', templateRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.message);
    res.status(500).json({ error: 'Server Failure. Please check backend logs.' });
});

// Database connection (Non-blocking)
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => console.log('✅ DB Connected'))
      .catch(err => console.error('❌ DB Error:', err.message));
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PROMPTCRAFT STABLE LIVE ON PORT ${PORT}`);
});
