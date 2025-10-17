const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
// Assuming getMockRatings is in './mockData' and handles the core logic
const { getMockRatings } = require('./mockData'); 

const app = express();

// --- CORRECTION FOR CORS POLICY ---

// 1. Define allowed origins for CORS. Protocol (https://) is CRITICAL.
// This list must include all frontend URLs that will access this API.
const allowedOrigins = [
  // Current Vercel Production Domain (CRITICAL FIX)
  'https://news-bias-aggregator.vercel.app', 
  // Current Specific Vercel Deployment Domain 
  'https://news-bias-aggregator-ocb7i8nax-dhruvalanandkars-projects.vercel.app',
  // You can include previous deployments if you think they might still be active
  'https://news-bias-aggregator-3o4yn674r-dhruvalanandkars-projects.vercel.app', 
  'https://news-bias-aggregator-git-main-dhruvalanandkars-projects.vercel.app',
  // Local development ports
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or local testing)
    if (!origin) return callback(null, true); 
    
    // Check if the request origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // If the origin is not allowed, block it.
      callback(new Error(`Not allowed by CORS: ${origin}`), false);
    }
  },
  // Ensure OPTIONS method is explicitly allowed for preflight requests
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', 
  credentials: true
};

// Apply the configured CORS middleware
app.use(cors(corsOptions));
// --- END CORS CORRECTION ---

app.use(express.json());

// Function from original code (assuming it's necessary for the reliability grade)
function gradeFromReliability(score) {
  if (score >= 90) return 'A (Highly Reliable)';
  if (score >= 75) return 'B (Mostly Reliable)';
  if (score >= 60) return 'C (Mixed Reliability)';
  if (score >= 45) return 'D (Questionable)';
  return 'F (Unreliable)';
}

// POST /api/analyze
// body: { url?: string, text?: string }
app.post('/api/analyze', async (req, res) => {
  // NOTE: Your original logic for fetching and calculating averages is preserved here.
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

    // Get ratings from mock sources (since the core logic is not provided)
    const ratings = await getMockRatings(articleText, url);

    // Calculate averages
    const averageReliability = Math.round(
      ratings.reduce((sum, r) => sum + r.reliability, 0) / ratings.length
    );

    const averageBias = ratings.reduce((sum, r) => sum + r.bias, 0) / ratings.length;

    const grade = gradeFromReliability(averageReliability);

    // Return data structure matching what the frontend expects
    res.json({ ratings, averageReliability, averageBias, grade });
  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).json({ error: 'Server error during analysis', details: err.message });
  }
});


// 2. Use the environment variable PORT provided by Render, or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
