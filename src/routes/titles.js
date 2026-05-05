const express = require('express');
const router = express.Router();

// Title suggestion bank keyed by niche keywords
const titleTemplates = [
  'How I {verb} {topic} in 60 Seconds 🔥',
  '{Number} {topic} Hacks You Need RIGHT NOW',
  'Stop Doing This With {topic} (Do This Instead)',
  'The {topic} Secret Nobody Talks About',
  'I Tried {topic} For 30 Days — Here\'s What Happened',
  'Why Your {topic} Isn\'t Working (Fix This)',
  '{topic} Tutorial: From Zero to Results Fast',
  'The Only {topic} Guide You\'ll Ever Need',
  'POV: You Just Discovered {topic}',
  '{topic} Tier List — Ranked Worst to Best',
];

const powerVerbs = ['mastered', 'fixed', 'built', 'hacked', 'optimized', 'transformed', 'unlocked'];
const numbers = ['3', '5', '7', '10', '12'];

function buildTitle(template, topic) {
  const verb = powerVerbs[Math.floor(Math.random() * powerVerbs.length)];
  const num = numbers[Math.floor(Math.random() * numbers.length)];
  return template
    .replace('{topic}', topic || 'YouTube Shorts')
    .replace('{verb}', verb)
    .replace('{Number}', num);
}

function scoreTitle(title) {
  let score = 50;
  if (title.length >= 40 && title.length <= 70) score += 20;
  if (/[\u{1F300}-\u{1F9FF}]/u.test(title)) score += 10;
  if (/\b(secret|hack|stop|never|always|only|best|worst|why|how)\b/i.test(title)) score += 15;
  if (/\d/.test(title)) score += 5;
  return Math.min(score, 100);
}

// POST /api/titles/optimize
router.post('/optimize', (req, res) => {
  const { topic, currentTitle } = req.body;

  if (!topic && !currentTitle) {
    return res.status(400).json({ error: 'Provide a topic or current title.' });
  }

  const keyword = topic || currentTitle;
  const suggestions = titleTemplates.slice(0, 5).map((tpl) => {
    const title = buildTitle(tpl, keyword);
    return {
      title,
      score: scoreTitle(title),
      tips: getTips(title),
    };
  });

  res.json({ suggestions });
});

function getTips(title) {
  const tips = [];
  if (title.length < 40) tips.push('Title is short — consider adding more context for better search visibility.');
  if (title.length > 70) tips.push('Title may be too long — YouTube truncates after ~70 chars on mobile.');
  if (!/[\u{1F300}-\u{1F9FF}]/u.test(title)) tips.push('Add an emoji to boost click-through rates.');
  if (!/[!?]/.test(title)) tips.push('A question or exclamation can increase curiosity.');
  return tips.length ? tips : ['Title looks strong! ✅'];
}

// GET /api/titles/keywords
router.get('/keywords', (req, res) => {
  const { niche } = req.query;
  const base = niche ? niche.toLowerCase() : 'youtube shorts';
  const keywords = [
    `${base} tips`,
    `${base} tutorial`,
    `${base} for beginners`,
    `${base} hack`,
    `${base} growth`,
    `how to ${base}`,
    `best ${base} strategy`,
    `${base} monetization`,
  ];
  res.json({ keywords });
});

module.exports = router;
