import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // Render preferred port

app.use(cors());
app.use(express.json());

// Ultra-minimal health check
app.get('/health', (req, res) => res.json({ status: 'OK', engine: 'PromptCraft 1.0', time: new Date() }));
app.get('/api/health', (req, res) => res.json({ status: 'API OK' }));
app.all('*', (req, res) => res.json({ status: 'online', path: req.path }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- ENGINE LIVE ON PORT ${PORT} ---`);
});
