import React, { useState, useEffect } from "react";

function AdBlocker() {
  const [adBlockerEnabled, setAdBlockerEnabled] = useState(false);
  const [customFilter, setCustomFilter] = useState("");
  const [blockedCount, setBlockedCount] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get(
      { adBlockerEnabled: false, blockedAdsCount: 0 },
      (result) => {
        setAdBlockerEnabled(result.adBlockerEnabled);
        setBlockedCount(result.blockedAdsCount);
      }
    );
  }, []);

  const handleToggle = () => {
    const newState = !adBlockerEnabled;
    setAdBlockerEnabled(newState);
    chrome.storage.sync.set({ adBlockerEnabled: newState });
  };

  const handleAddFilter = () => {
    if (customFilter.trim()) {
      chrome.storage.sync.get({ customFilters: [] }, (result) => {
        const filters = result.customFilters;
        filters.push(customFilter.trim());
        chrome.storage.sync.set({ customFilters: filters }, () => {
          setCustomFilter("");
          alert("Filter added successfully!");
        });
      });
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">🚫 Ad Blocker</h2>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={adBlockerEnabled}
          onChange={handleToggle}
          className="w-5 h-5"
        />
        <span className="text-lg">Enable Ad Blocker</span>
      </label>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Custom Filters</h3>
        <input
          type="text"
          value={customFilter}
          onChange={(e) => setCustomFilter(e.target.value)}
          placeholder="Enter domain to block"
          className="border p-2 w-full rounded-md"
        />
        <button
          onClick={handleAddFilter}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Filter
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Blocked Ads Count: {blockedCount}</h3>
      </div>
    </div>
  );
}

export default AdBlocker;
