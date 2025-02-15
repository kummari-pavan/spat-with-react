import React, { useState, useEffect } from 'react';

function TabManager() {
  const [tabGroups, setTabGroups] = useState({});

  useEffect(() => {
    updateTabGroups();
  }, []);

  const updateTabGroups = () => {
    chrome.tabs.query({}, (tabs) => {
      const groups = {};
      tabs.forEach((tab) => {
        const domain = new URL(tab.url).hostname;
        if (!groups[domain]) {
          groups[domain] = [];
        }
        groups[domain].push(tab);
      });
      setTabGroups(groups);
    });
  };

  const handleSaveSession = () => {
    chrome.tabs.query({}, (tabs) => {
      const session = tabs.map((tab) => ({ url: tab.url, title: tab.title }));
      chrome.storage.sync.set({ savedSession: session }, () => {
        alert('Session saved successfully!');
      });
    });
  };

  const handleRestoreSession = () => {
    chrome.storage.sync.get({ savedSession: [] }, (result) => {
      const session = result.savedSession;
      session.forEach((tab) => {
        chrome.tabs.create({ url: tab.url });
      });
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-4">Tab Manager</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(tabGroups).map(([domain, tabs]) => (
          <div key={domain} className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">{domain} ({tabs.length})</h3>
            <ul className="mt-2 text-sm text-gray-600">
              {tabs.map((tab, index) => (
                <li key={index} className="border-b py-1">{tab.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleSaveSession}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Save Session
        </button>
        <button
          onClick={handleRestoreSession}
          className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Restore Session
        </button>
      </div>
    </div>
  );
}

export default TabManager;
