import express from 'express';

const router = express.Router();

router.post('/recommend', async (req, res) => {
  try {
    const { movies } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `User's watched movies:\n${movies.map(m => `- ${m.title} rated ${m.rating}/10`).join('\n')}\n\nRecommend 5 movies they haven't seen. Return ONLY a JSON array:\n[{"title":"...","year":2020,"genre":"...","reason":"..."}]`
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const recommendations = JSON.parse(text.replace(/```json|```/g, '').trim());
    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

export default router;