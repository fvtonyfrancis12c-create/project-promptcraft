import express from 'express';

const router = express.Router();

const templates = [
  { id: 1, category: 'Marketing', title: 'Product Launch Email', prompt: 'Write a persuasive product launch email for a new eco-friendly water bottle targeting environmentally conscious millennials.' },
  { id: 2, category: 'Marketing', title: 'Social Media Ad Copy', prompt: 'Create 3 engaging Facebook ad copies for a summer sale on sunglasses. Include a strong hook and call to action.' },
  { id: 3, category: 'Coding', title: 'React Component', prompt: 'Create a responsive React functional component in Tailwind CSS for a pricing table with 3 tiers.' },
  { id: 4, category: 'Coding', title: 'Python Web Scraper', prompt: 'Write a Python script using BeautifulSoup to scrape the titles and URLs of articles from a blog page.' },
  { id: 5, category: 'Research', title: 'Literature Review', prompt: 'Summarize the key findings of recent studies on the impact of remote work on employee productivity.' },
  { id: 6, category: 'Research', title: 'Market Analysis', prompt: 'Provide a comprehensive overview of the current trends in the electric vehicle market, including key competitors and future projections.' },
  { id: 7, category: 'Image Generation', title: 'Cyberpunk Cityscape', prompt: 'A highly detailed cyberpunk cityscape at night, neon lights reflecting in puddles, flying cars, towering skyscrapers, cinematic lighting, 8k resolution, octane render.' },
  { id: 8, category: 'Image Generation', title: 'Fantasy Character', prompt: 'Concept art of a noble elven warrior with intricate silver armor, glowing blue eyes, holding a glowing magical sword, enchanted forest background, digital painting, dramatic lighting.' },
  { id: 9, category: 'Chatbot', title: 'Customer Support Agent', prompt: 'Act as a friendly and helpful customer support agent for an online electronics store. The user is asking about the return policy for a defective laptop.' },
  { id: 10, category: 'Chatbot', title: 'Language Tutor', prompt: 'Act as a Spanish language tutor. Correct any grammatical mistakes I make and suggest more natural phrasing. Let us start a conversation about our weekend plans.' }
];

router.get('/', (req, res) => {
  res.json(templates);
});

export default router;
