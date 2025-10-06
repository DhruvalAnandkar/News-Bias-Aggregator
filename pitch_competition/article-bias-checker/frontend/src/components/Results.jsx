import React from 'react';

function biasLabelFromScore(bias) {
  if (bias > 0.25) return 'Right';
  if (bias < -0.25) return 'Left';
  return 'Center';
}

export default function Results({ results }) {
  const { ratings, averageReliability, averageBias, grade } = results;
  return (
    <div className="mt-6 border-t pt-6">
      <h2 className="text-lg font-semibold">Results</h2>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-500">Average Reliability</div>
          <div className="text-2xl font-bold">{averageReliability}%</div>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-500">Average Bias</div>
          <div className="text-2xl font-bold">
            {averageBias.toFixed(2)} ({biasLabelFromScore(averageBias)})
          </div>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-500">Grade</div>
          <div className="text-2xl font-bold">{grade}</div>
        </div>
      </div>

      <h3 className="mt-6 font-semibold">Breakdown by source</h3>
      <div className="mt-3 space-y-3">
        {ratings.map((r) => (
          <div key={r.source} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{r.source}</div>
              <div className="text-sm text-gray-500">
                Verdict: <span className="font-semibold">{r.label}</span>
              </div>
              <div className="text-sm text-gray-500">
                Bias: {biasLabelFromScore(r.bias)} ({r.bias.toFixed(2)})
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Score</div>
              <div className="text-lg font-bold">{r.reliability}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
