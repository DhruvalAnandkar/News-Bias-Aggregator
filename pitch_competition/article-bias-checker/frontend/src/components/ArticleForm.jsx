import React, { useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


export default function ArticleForm({ onResults }) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {};
      if (url) payload.url = url;
      if (text) payload.text = text;
      // 2. Construct the full URL for the API call
      const fullUrl = `${API_BASE_URL}/api/analyze`;
      
      // 3. Use the full URL in the axios request
      const res = await axios.post(fullUrl, payload);

      onResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Article URL (optional)</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Or paste the article text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="6"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </div>

      <div className="flex items-center gap-3">
        <button disabled={loading} type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Analyze Article'}
        </button>
        <button type="button" onClick={() => { setUrl(''); setText(''); onResults(null); }} className="px-3 py-2 border rounded-md">
          Reset
        </button>
      </div>

      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}
