const express = require('express');
const router = express.Router();

// Simple rule-based AI chat (replace with OpenAI call when API key is available)
const responses = {
  title:       'For title optimization, keep it 40–70 characters, add an emoji, and use power words like "secret", "hack", or "stop". Try asking me: "Suggest a title about [your topic]".',
  thumbnail:   'Great thumbnails on Shorts use bold 3–5 word text, high-contrast colors, and a face showing strong emotion. The top-third rule works well — place your text there.',
  seo:         'For SEO, fill your description to 150+ characters, add 5–10 niche tags, use the first line as a hook (it shows in search), and always include a call-to-action link.',
  analytics:   'Check your CTR first — if it\'s below 4%, your thumbnail or title needs work. Watch time per view tells you retention. Aim for 50%+ average view duration.',
  monetize:    'To monetize Shorts: reach 1,000 subs + 10M public Shorts views in 90 days for the YouTube Partner Program. Also use affiliate links in bio and sell digital products.',
  growth:      'Post at least 3–5 Shorts per week. Reply to every comment in the first hour — this signals engagement to the algorithm. Use trending audio within 3 days of release.',
  hashtag:     'Use 3–5 hashtags max. Always include #Shorts. Add one broad niche tag and one trending tag. Avoid tag stuffing — it can hurt distribution.',
  default:     'I\'m your Tube Shorts Pro AI! Ask me about titles, thumbnails, SEO, analytics, monetization, hashtags, or growth strategies.',
};

function getResponse(message) {
  const msg = message.toLowerCase();
  if (/title|headline|hook/.test(msg)) return responses.title;
  if (/thumbnail|image|cover|art/.test(msg)) return responses.thumbnail;
  if (/seo|search|tag|keyword|description/.test(msg)) return responses.seo;
  if (/analytic|view|ctr|watch|metric|stat/.test(msg)) return responses.analytics;
  if (/monetiz|money|earn|income|revenue|partner/.test(msg)) return responses.monetize;
  if (/grow|subscriber|algorithm|post|schedule/.test(msg)) return responses.growth;
  if (/hashtag|#/.test(msg)) return responses.hashtag;
  return responses.default;
}

// POST /api/chat
router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Provide a message.' });
  const reply = getResponse(message);
  res.json({ reply, timestamp: new Date().toISOString() });
});

module.exports = router;
