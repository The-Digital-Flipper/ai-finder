const express = require('express');
const router = express.Router();

// POST /api/build — receives a natural-language prompt and returns build steps
// In production, wire this to an LLM (OpenAI, Anthropic, etc.)
router.post('/', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Provide a prompt.' });

  // Simulated build plan (replace with real AI call)
  const steps = [
    'Scaffold project structure',
    'Install dependencies',
    'Create entry point (index.js / main.py)',
    'Set up routing / handlers',
    'Wire up database / storage',
    'Add environment config (.env)',
    'Run dev server and health check',
  ];

  res.json({
    name: prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 4).join('-'),
    steps,
    ready: true,
  });
});

module.exports = router;
