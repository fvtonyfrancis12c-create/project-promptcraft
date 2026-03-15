import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;

console.log('--- BOOTING CORE ENGINE ---');
console.log('Port:', PORT);
console.log('Env:', process.env.NODE_ENV);

app.get('/health', (req, res) => {
  console.log('Health check received');
  res.status(200).json({ status: 'OK', mode: 'CORE_ONLY' });
});

app.get('/api/health', (req, res) => {
  console.log('API Health check received');
  res.status(200).json({ status: 'API OK', mode: 'CORE_ONLY' });
});

app.get('*', (req, res) => {
  res.send('PromptCraft Core Engine is Live. All features currently in maintenance mode.');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CORE ENGINE LIVE ON PORT ${PORT}`);
});
