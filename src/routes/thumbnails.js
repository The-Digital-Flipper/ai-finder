const express = require('express');
const router = express.Router();

const colorPalettes = {
  high_energy: ['#FF0000', '#FF6B00', '#FFCC00', '#FFFFFF'],
  calm:        ['#1A1A2E', '#16213E', '#0F3460', '#E94560'],
  vibrant:     ['#7B2FBE', '#FF006E', '#FB5607', '#FFBE0B'],
  minimal:     ['#000000', '#FFFFFF', '#CCCCCC', '#888888'],
};

const fontPairings = [
  { headline: 'Bebas Neue', sub: 'Roboto' },
  { headline: 'Impact', sub: 'Open Sans' },
  { headline: 'Montserrat Black', sub: 'Lato' },
  { headline: 'Anton', sub: 'Poppins' },
];

const overlayIdeas = [
  'Bold text overlay in the top-third with contrasting outline stroke',
  'Person reacting with text pop in lower-third',
  'Split-screen: before vs after comparison',
  'Arrow pointing at key element with zoom burst effect',
  'Countdown timer overlay in corner (3…2…1)',
  'Captions burned-in with highlight bar',
];

// POST /api/thumbnails/suggestions
router.post('/suggestions', (req, res) => {
  const { topic, mood = 'high_energy' } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Provide a topic.' });
  }

  const palette = colorPalettes[mood] || colorPalettes.high_energy;
  const font = fontPairings[Math.floor(Math.random() * fontPairings.length)];
  const overlays = overlayIdeas.sort(() => 0.5 - Math.random()).slice(0, 3);

  res.json({
    palette,
    font,
    overlays,
    tips: [
      'Use a 9:16 ratio (1080×1920) for Shorts thumbnails.',
      'Keep text to 3–5 words maximum for readability on small screens.',
      `Dominant color suggestion: ${palette[0]} paired with ${palette[3]} for contrast.`,
      'Faces with expressive emotions get up to 38% more clicks.',
      'Use the top and bottom thirds — avoid dead center placement.',
    ],
    ctaText: `Try: "${topic.toUpperCase()}"`,
  });
});

// GET /api/thumbnails/color-palettes
router.get('/color-palettes', (req, res) => {
  res.json({ palettes: Object.keys(colorPalettes).map((key) => ({ name: key, colors: colorPalettes[key] })) });
});

module.exports = router;
