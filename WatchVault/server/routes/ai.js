import express from 'express';

const router = express.Router();

    const PROMPT = (movies, recommendations) => {
      const watchedTitles = movies.map(m => m.title).join(', ');
      const topRated = [...movies]
        .sort((a, b) => b.user_rating - a.user_rating)
        .slice(0, 5)
        .map(m => `- "${m.title}" (${m.genre}, ${m.release_year}) — rated ${m.user_rating}/10`)
        .join('\n');

      return `You are a film curator with deep knowledge of cinema. Your job is to recommend movies a user will genuinely love based on their taste profile.

    USER'S TOP-RATED MOVIES:
    ${topRated}

    FULL WATCHED LIST (do not recommend these or their direct sequels):
    ${watchedTitles}

    TASK:
    Recommend exactly 5 movies. Apply these rules:
    1. Prioritize what made their top-rated films compelling — look for patterns in genre, tone, era, themes, director style, and pacing
    2. Vary the recommendations: don't pick 5 movies from the same genre or decade
    3. Include at least one non-English language film if it genuinely fits their taste
    4. The "reason" must be specific to THIS user's taste — reference an actual movie they've seen, e.g. "If you loved the slow burn of X, you'll connect with Y's..." not exactly the same phrasing but you get the idea
    5. Avoid generic blockbusters they've almost certainly seen already
    6. Prefer hidden gems and underseen films alongside any well-known picks
    ${recommendations && recommendations.length > 0 ? `7. If the user asked for more, continue the list with 5 more recommendations that follow the same rules as above, and do not repeat any movies from the previous recommendations.` : ''}
    STRICT: If the user asked for more which is if i a am sending you aleady a list of recommendations, you should continue the list with 5 more recommendations that follow the same rules as above, and do not repeat any movies from the previous recommendations.
    Return ONLY a valid JSON array, no markdown, no explanation:
    [{"title":"...","year":2020,"genre":"...","imdb_id":"tt1234567","reason":"..."}]`;
    };
const callGemini = async (apiKey, model, movies, recommendations) => {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT(movies, recommendations) }] }] }),
    }
  );

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Gemini ${model} error ${resp.status}: ${err?.error?.message ?? 'unknown'}`);
  }

  return resp.json();
};

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
router.post('/recommend/more', async (req, res) => {
  const { movies, recommendations } = req.body;
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
      data = await callGemini(key, model, movies, recommendations);
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