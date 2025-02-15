import React, { useState, useEffect } from "react";

function Productivity() {
  const [productivityStats, setProductivityStats] = useState({});

  useEffect(() => {
    updateProductivityStats();
  }, []);

  const updateProductivityStats = () => {
    chrome.storage.sync.get({ productivityStats: {} }, (result) => {
      setProductivityStats(result.productivityStats);
    });
  };

  const handleResetStats = () => {
    chrome.storage.sync.set({ productivityStats: {} }, () => {
      updateProductivityStats();
      alert("Productivity stats reset!");
    });
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">📊 Productivity Tracker</h2>
      <ul className="list-disc pl-5">
        {Object.entries(productivityStats).map(([domain, time]) => (
          <li key={domain} className="text-lg">
            {domain}: {Math.round(time / 60)} minutes
          </li>
        ))}
      </ul>
      <button
        onClick={handleResetStats}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
      >
        Reset Stats
      </button>
    </div>
  );
}

export default Productivity;
