import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/health', (req, res) => res.json({ status: 'ROOT_PROXY_OK' }));
app.get('*', (req, res) => res.send('PromptCraft Root Proxy Online. Please verify Render Root Directory settings.'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Root proxy live on ${PORT}`);
});
