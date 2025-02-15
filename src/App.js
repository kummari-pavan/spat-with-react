import React, { useState } from 'react';
import './App.css';
import AdBlocker from './components/AdBlocker';
import Productivity from './components/Productivity';
import Notes from './components/Notes';
import TabManager from './components/TabManager';

function App() {
  const [activeTab, setActiveTab] = useState('ad-blocker');

  const renderContent = () => {
    switch (activeTab) {
      case 'ad-blocker':
        return <AdBlocker />;
      case 'productivity':
        return <Productivity />;
      case 'notes':
        return <Notes />;
      case 'tab-manager':
        return <TabManager />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>SPAT</h1>
      <div className="tabs">
        <button className={activeTab === 'ad-blocker' ? 'active' : ''} onClick={() => setActiveTab('ad-blocker')}>Ad Blocker</button>
        <button className={activeTab === 'productivity' ? 'active' : ''} onClick={() => setActiveTab('productivity')}>Productivity</button>
        <button className={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}>Notes</button>
        <button className={activeTab === 'tab-manager' ? 'active' : ''} onClick={() => setActiveTab('tab-manager')}>Tab Manager</button>
      </div>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;