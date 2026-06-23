import express from 'express';

const router = express.Router();

const PROMPT = (movies) =>
  `User's watched movies:\n${movies.map(m => `- ${m.title} rated ${m.vote_average}/10`).join('\n')}\n\nRecommend 5 movies they haven't seen. Return ONLY a JSON array:\n[{"title":"...","year":2020,"genre":"...","reason":"..."}]`;

const callGemini = async (apiKey, model, movies) => {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT(movies) }] }] }),
    }
  );

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Gemini ${model} error ${resp.status}: ${err?.error?.message ?? 'unknown'}`);
  }

  return resp.json();
};

// Priority order: try the best model first, fall back to more available ones
const getAttempts = () => {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY2,
    process.env.GEMINI_API_KEY3,
  ].filter(Boolean);

  if (keys.length === 0) return [];

  return [
    { model: 'gemini-2.5-flash', key: keys[0] },     
    { model: 'gemini-2.5-flash-lite', key: keys[0] },         
    ...keys.slice(1).map(key => ({                        
      model: 'gemini-2.0-flash', key
    })),
  ];
};

router.post('/recommend', async (req, res) => {
  const { movies } = req.body;
  const attempts = getAttempts();

  if (attempts.length === 0) {
    console.error('No Gemini API keys configured');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  let data;
  let lastError;

  for (const { model, key } of attempts) {
    try {
      console.log(`Trying ${model} with key ...${key.slice(-4)}`);
      data = await callGemini(key, model, movies);
      console.log(`Success with ${model}`);
      break;
    } catch (err) {
      console.warn(`${model} (key ...${key.slice(-4)}) failed:`, err.message);
      lastError = err;
    }
  }

  if (!data) {
    console.error('All attempts exhausted:', lastError?.message);
    return res.status(502).json({ message: 'Failed to get recommendations' });
  }

  try {
    const text = data.candidates[0].content.parts[0].text;
    const recommendations = JSON.parse(text.replace(/```json|```/g, '').trim());
    res.json({ recommendations });
  } catch (err) {
    console.error('Failed to parse Gemini response:', err);
    res.status(500).json({ message: 'Invalid response from AI' });
  }
});

export default router;