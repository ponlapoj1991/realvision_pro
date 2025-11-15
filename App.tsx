
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatPlayground from './components/ChatPlayground';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0f3f8] text-[#1d252d] font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-auto">
          <ChatPlayground />
        </main>
      </div>
    </div>
  );
};

export default App;
