const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { getMockRatings } = require('./mockData');

const app = express();

// --- START FIXES FOR CORS AND DEPLOYMENT ---

// 1. Define allowed origins for CORS
const allowedOrigins = [
  // Your temporary Vercel deployment URL (from the error)
  'https://news-bias-aggregator-cgg7e6a6q-dhruvalanandkars-projects.vercel.app',
  // Your main Vercel domain/alias (if applicable)
  'https://news-bias-aggregator.vercel.app', 
  // Local development ports (Vite default is usually 5173, but include common ones)
  'http://localhost:5173',
  'http://localhost:3000' 
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or local testing)
    if (!origin) return callback(null, true); 
    
    // Check if the request origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // If the origin is not allowed, throw an error.
      callback(new Error(`CORS policy blocks access from origin: ${origin}`), false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all necessary methods, including OPTIONS (preflight)
  credentials: true
};

// Apply the configured CORS middleware
app.use(cors(corsOptions));
// --- END CORS FIX ---

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
    console.error('API Error:', err.message);
    res.status(500).json({ error: 'Server error during analysis', details: err.message });
  }
});

function gradeFromReliability(score) {
  if (score >= 90) return 'A (Highly Reliable)';
  if (score >= 75) return 'B (Mostly Reliable)';
  if (score >= 60) return 'C (Mixed Reliability)';
  if (score >= 45) return 'D (Questionable)';
  return 'F (Unreliable)';
}

// 2. Use the environment variable PORT provided by Render, or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
