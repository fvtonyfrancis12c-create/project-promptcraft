import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => res.send('MINIMAL OK'));
app.get('*', (req, res) => res.send('PromptCraft Minimal Engine Online'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Minimal server live on ${PORT}`);
});
