require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const titlesRouter = require('./src/routes/titles');
const thumbnailsRouter = require('./src/routes/thumbnails');
const analyticsRouter = require('./src/routes/analytics');
const chatRouter = require('./src/routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/titles', titlesRouter);
app.use('/api/thumbnails', thumbnailsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/chat', chatRouter);

// Serve index for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Tube Shorts Pro running at http://localhost:${PORT}`);
});
