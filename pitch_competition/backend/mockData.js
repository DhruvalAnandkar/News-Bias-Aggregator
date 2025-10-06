// backend/mockData.js
// Returns an array of { source, verdict, reliability (0-100), bias (-1..1) }
module.exports.getMockRatings = async function (articleText = "", url = "") {
  const sources = ["PolitiFact", "Snopes", "FactCheck.org"];

  // Possible verdicts with associated score ranges
  const verdictOptions = [
    { verdict: "True", min: 90, max: 100 },
    { verdict: "Mostly True", min: 75, max: 89 },
    { verdict: "Half True", min: 60, max: 74 },
    { verdict: "Mostly False", min: 40, max: 59 },
    { verdict: "False", min: 20, max: 39 },
    { verdict: "Unverified", min: 45, max: 70 },
    { verdict: "Biased", min: 35, max: 65 },
  ];

  // Simple "seed" from article length so different articles → different pattern
  const seed = articleText.length || Math.floor(Math.random() * 1000);

  function randomFromSeed(seed, offset, range) {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * range);
  }

  const ratings = sources.map((src, idx) => {
    // Pick a verdict based on seeded randomness
    const vIndex = randomFromSeed(seed, idx * 17, verdictOptions.length);
    const verdict = verdictOptions[vIndex].verdict;

    // Reliability within the verdict’s range
    const min = verdictOptions[vIndex].min;
    const max = verdictOptions[vIndex].max;
    const reliability = min + randomFromSeed(seed, idx * 31, max - min + 1);

    // Bias based on presence of keywords
    let bias = 0;
    const lower = articleText.toLowerCase();
    if (lower.includes("trump")) bias += 0.3;
    if (lower.includes("biden")) bias -= 0.3;
    if (lower.includes("opinion")) bias += 0.15;
    if (lower.includes("editorial")) bias -= 0.15;

    // Tiny per-source offset
    bias += (idx - 1) * 0.1; // -0.1, 0, +0.1

    return { source: src, verdict, reliability, bias };
  });

  return ratings;
};
