require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const buildRouter = require('./src/routes/build');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/build', buildRouter);

// Serve index for all other routes (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Finder running at http://localhost:${PORT}`);
});
