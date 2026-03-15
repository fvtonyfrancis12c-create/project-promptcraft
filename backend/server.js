import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import historyRoutes from './routes/history.route.js';
import promptRoutes from './routes/api.route.js'; // Renamed from apiRoutes
import templateRoutes from './routes/template.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Connect to MongoDB with timeout
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/promptcraft', {
  serverSelectionTimeoutMS: 5000 // 5 seconds
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Application will run without database features (History will be disabled)');
  });

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL // Will be added in Render/Vercel
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'PromptCraft AI Lab API is operational.',
        environment: process.env.NODE_ENV || 'production',
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected/connecting'
    });
});
app.use('/api', promptRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/templates', templateRoutes);

// Error formatting middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something broke on the server!' });
});

app.listen(PORT, () => {
    console.log(`🚀 PROMPTCRAFT ENGINE v2.0 LIVE ON PORT ${PORT}`);
    console.log('--- Production Mode Active ---');
});
