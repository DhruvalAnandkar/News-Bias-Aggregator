// backend/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { getMockRatings } = require('./mockData');

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/analyze
// body: { url?: string, text?: string }
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, text } = req.body;
    let articleText = text;

    // If user sent a URL but no text, fetch and extract <p> or <article> text
    if (!articleText && url) {
      const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = response.data;
      const $ = cheerio.load(html);

      let paragraphs = [];
      if ($('article').length) {
        $('article p').each((i, el) => paragraphs.push($(el).text()));
      } else {
        $('p').each((i, el) => paragraphs.push($(el).text()));
      }

      articleText = paragraphs.join('\n\n').trim();
    }

    if (!articleText) {
      return res.status(400).json({ error: 'Please provide a URL or paste article text.' });
    }

    // Get ratings from mock sources
    const ratings = await getMockRatings(articleText, url);

    // Calculate averages
    const averageReliability = Math.round(
      ratings.reduce((sum, r) => sum + r.reliability, 0) / ratings.length
    );

    const averageBias = ratings.reduce((sum, r) => sum + r.bias, 0) / ratings.length;

    const grade = gradeFromReliability(averageReliability);

    res.json({ ratings, averageReliability, averageBias, grade });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

function gradeFromReliability(score) {
  if (score >= 90) return 'A (Highly Reliable)';
  if (score >= 75) return 'B (Mostly Reliable)';
  if (score >= 60) return 'C (Mixed Reliability)';
  if (score >= 45) return 'D (Questionable)';
  return 'F (Unreliable)';
}

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running: http://localhost:${PORT}`));
