import React, { useState } from "react";
import ArticleForm from "./components/ArticleForm";
import Results from "./components/Results";
import LandingPage from "./LandingPage";

export default function App() {
  const [started, setStarted] = useState(false); // controls Landing → Analyzer
  const [results, setResults] = useState(null);

  if (!started) {
    // Show Landing Page first
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  // Show Analyzer once started
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Sherlock News Bias Checker</h1>
        <p className="text-sm text-gray-600 mb-4">
          Paste an article URL or paste the text. We'll compare ratings from
          several sources and show an average grade.
        </p>

        <ArticleForm onResults={setResults} />

        {results && <Results results={results} />}
      </div>
    </div>
  );
}
