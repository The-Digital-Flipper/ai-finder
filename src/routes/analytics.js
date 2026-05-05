const express = require('express');
const router = express.Router();

// Mock analytics — in production replace with real YouTube Data API v3 calls
function generateMockTimeSeries(days = 30) {
  const data = [];
  let base = Math.floor(Math.random() * 500) + 200;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    base = Math.max(50, base + Math.floor((Math.random() - 0.4) * 80));
    data.push({ date: date.toISOString().split('T')[0], views: base });
  }
  return data;
}

// GET /api/analytics/overview
router.get('/overview', (req, res) => {
  res.json({
    totals: {
      views: 124_350,
      subscribers: 3_820,
      watchTimeHours: 9_210,
      avgViewDuration: '00:38',
      ctr: '6.4%',
      impressions: 1_941_000,
    },
    growth: {
      views: '+18%',
      subscribers: '+31%',
      watchTimeHours: '+12%',
      ctr: '+0.9%',
    },
    topVideos: [
      { title: 'I tried this for 30 days 🔥', views: 18_400, ctr: '9.1%', likes: 1_230 },
      { title: '5 Shorts Hacks You Need NOW', views: 14_200, ctr: '8.4%', likes: 980 },
      { title: 'Stop making this mistake', views: 12_800, ctr: '7.7%', likes: 850 },
      { title: 'POV: Your first 1000 subs', views: 11_100, ctr: '7.2%', likes: 740 },
      { title: 'The thumbnail secret', views: 9_600, ctr: '6.9%', likes: 610 },
    ],
    audienceSplit: {
      mobile: 82,
      desktop: 11,
      tablet: 7,
    },
  });
});

// GET /api/analytics/timeseries
router.get('/timeseries', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  res.json({ series: generateMockTimeSeries(days) });
});

// GET /api/analytics/seo-score
router.get('/seo-score', (req, res) => {
  const { title, description = '', tags = '' } = req.query;
  if (!title) return res.status(400).json({ error: 'Provide a title.' });

  let score = 40;
  const breakdown = [];

  if (title.length >= 40 && title.length <= 70) {
    score += 20; breakdown.push({ item: 'Title length optimal', points: 20, status: 'pass' });
  } else {
    breakdown.push({ item: 'Title length', points: 0, status: 'fail', hint: 'Aim for 40–70 characters' });
  }
  if (description.length >= 150) {
    score += 15; breakdown.push({ item: 'Description length', points: 15, status: 'pass' });
  } else {
    breakdown.push({ item: 'Description too short', points: 0, status: 'fail', hint: 'Add at least 150 characters' });
  }
  if (tags.split(',').filter(Boolean).length >= 5) {
    score += 15; breakdown.push({ item: 'Tags (5+ added)', points: 15, status: 'pass' });
  } else {
    breakdown.push({ item: 'Not enough tags', points: 0, status: 'fail', hint: 'Add at least 5 relevant tags' });
  }
  if (/[\u{1F300}-\u{1F9FF}]/u.test(title)) {
    score += 10; breakdown.push({ item: 'Emoji in title', points: 10, status: 'pass' });
  } else {
    breakdown.push({ item: 'No emoji in title', points: 0, status: 'warn', hint: 'Emojis can improve CTR' });
  }

  res.json({ score: Math.min(score, 100), breakdown });
});

module.exports = router;
