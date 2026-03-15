import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        const key = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        
        console.log('Fetching model list from:', url.replace(key, 'REDACTED'));
        const resp = await fetch(url);
        const data = await resp.json();
        
        if (data.error) {
            console.error('API Error:', JSON.stringify(data.error, null, 2));
        } else {
            console.log('SUCCESS: Key is valid. Available Models:');
            data.models?.slice(0, 3).forEach(m => console.log(`- ${m.name}`));
        }
    } catch (e) {
        console.error('FETCH FAILED:', e.message);
    }
};

test();
