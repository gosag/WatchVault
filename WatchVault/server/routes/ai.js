import express from 'express';

const router = express.Router();

router.post('/recommend', async (req, res) => {
  try {
    const { movies } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if(!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    console.log("API Key:", apiKey);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `User's watched movies:\n${movies.map(m => `- ${m.title} rated ${m.vote_average}/10`).join('\n')}\n\nRecommend 5 movies they haven't seen. Return ONLY a JSON array:\n[{"title":"...","year":2020,"genre":"...","reason":"..."}]`
        }]
      }]
  })
});

const data = await response.json();
console.log('Gemini response:', JSON.stringify(data, null, 2));
if(!data || !data.candidates || data.candidates.length === 0) {
  console.error('No candidates in Gemini response');
  return res.status(500).json({ message: 'Failed to get recommendations' });
}
const text = data.candidates[0].content.parts[0].text;
console.log('Raw response from AI:', text);
console.log('Parsed recommendations:', JSON.parse(text.replace(/```json|```/g, '').trim()));
const recommendations = JSON.parse(text.replace(/```json|```/g, '').trim());
res.json({ recommendations });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

export default router;

