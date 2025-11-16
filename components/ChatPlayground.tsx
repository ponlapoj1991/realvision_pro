
import React, { useState } from 'react';
import ChatPanel from './ChatPanel';
import { QuestionMarkIcon } from './icons/Icons';

const ChatPlayground: React.FC = () => {
  const [compareMode, setCompareMode] = useState(false);

  return (
    <div className="h-full flex flex-col bg-[#f0f3f8]">
      <div className="bg-[#f9fafc] border-b border-gray-200/60 p-4 flex justify-between items-center flex-wrap">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-[#1d252d]">Chat Playground</h1>
          <QuestionMarkIcon />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-[#667085]">Compare Model</span>
          <label htmlFor="compare-toggle" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="compare-toggle" className="sr-only peer" checked={compareMode} onChange={() => setCompareMode(!compareMode)} />
            <div className="w-10 h-5 bg-[#a6b0cf] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#4cc764]"></div>
          </label>
        </div>
      </div>
      
      <div className="flex-1 p-5 flex flex-col min-h-0">
        <div className="bg-white rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <div className={`flex flex-col md:flex-row gap-6 h-full ${compareMode ? '' : 'justify-center'}`}>
                <div className={compareMode ? 'w-full md:w-1/2' : 'w-full md:w-3/4'}>
                    <ChatPanel modelId="A" />
                </div>
                {compareMode && (
                <div className="w-full md:w-1/2">
                    <ChatPanel modelId="B" />
                </div>
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

export default ChatPlayground;