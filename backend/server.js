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

let lastError = null;

console.log('--- PROMPTCRAFT ULTIMATE ENGINE STARTING ---');

app.use(cors());
app.use(express.json());

// Diagnostic middleware
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.path}`);
    next();
});

// Health check with error reporting
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        hasKey: !!process.env.GEMINI_API_KEY, 
        version: '11.0.ULTIMATE',
        lastError: lastError ? { message: lastError.message, stack: lastError.stack } : 'None'
    });
});

app.get('/', (req, res) => res.json({ status: 'online', version: '11.0.ULTIMATE' }));

// Routes
app.use('/api', promptRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/templates', templateRoutes);

// Detailed Error Handling
app.use((err, req, res, next) => {
    lastError = err;
    console.error('ENGINE ERROR:', err.message);
    res.status(500).json({ 
        error: 'Engine Error', 
        message: err.message, 
        version: '11.0.ULTIMATE'
    });
});

// DB Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => console.log('✅ DB Connected'))
      .catch(err => {
          lastError = err;
          console.error('❌ DB Error:', err.message);
      });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ULTIMATE ENGINE LIVE ON ${PORT}`);
});
