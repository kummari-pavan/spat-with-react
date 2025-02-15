import React, { useState, useEffect } from "react";

function Notes() {
  const [localNotes, setLocalNotes] = useState("");
  const [globalNotes, setGlobalNotes] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      chrome.storage.sync.get({ notes: {} }, (result) => {
        const notes = result.notes;
        setLocalNotes(notes[currentUrl] || "");
        setGlobalNotes(notes.global || "");
      });
    });
  }, []);

  const handleSaveNotes = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      chrome.storage.sync.get({ notes: {} }, (result) => {
        const notes = result.notes;
        notes[currentUrl] = localNotes;
        notes.global = globalNotes;
        chrome.storage.sync.set({ notes: notes }, () => {
          alert("Notes saved successfully!");
        });
      });
    });
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">📝 Smart Notes</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Local Notes</h3>
        <textarea
          rows="4"
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          placeholder="Enter local notes..."
          className="border p-2 w-full rounded-md"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Global Notes</h3>
        <textarea
          rows="4"
          value={globalNotes}
          onChange={(e) => setGlobalNotes(e.target.value)}
          placeholder="Enter global notes..."
          className="border p-2 w-full rounded-md"
        />
      </div>

      <button
        onClick={handleSaveNotes}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Save Notes
      </button>
    </div>
  );
}

export default Notes;
