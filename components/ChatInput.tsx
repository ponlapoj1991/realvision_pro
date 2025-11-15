
import React, { useRef, useEffect } from 'react';
import { SendIcon, ClearIcon, MicIcon } from './icons/Icons';

interface ChatInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onClearChat: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ userInput, setUserInput, isLoading, onSendMessage, onClearChat }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [userInput]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-3">
      <div className="bg-[#dee7fc] rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="flex-grow bg-white border border-[#d0d5dd] rounded-lg p-2 flex items-end relative min-h-[56px]">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type user query here. (Shift + Enter for new line)"
              className="w-full bg-transparent border-none outline-none resize-none text-sm text-[#667085] placeholder:text-gray-400 pl-4 pr-12 max-h-40"
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={onSendMessage} 
              disabled={isLoading || !userInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#0057d8] rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              title="Send Message"
            >
              <SendIcon />
            </button>
          </div>
          <button 
            onClick={onClearChat} 
            className="p-2.5 flex items-center justify-center bg-[#0057d8] rounded-lg transition-colors active:bg-blue-800" 
            title="Clear Chat History"
          >
            <ClearIcon />
          </button>
        </div>
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-1.5">
            <button className="p-1 rounded-md bg-[#f9fafb] shadow-sm cursor-pointer" title="Toggle Voice Recognition">
              <MicIcon />
            </button>
          </div>
          <div className="text-xs font-medium text-[#667085]">{userInput.length} / 200000</div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
