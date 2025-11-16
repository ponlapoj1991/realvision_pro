import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Message } from '../types';
import { RealVisionBotIcon, UserIcon } from './icons/Icons';
import { ThinkingBox } from './ThinkingBox';


interface ChatMessageProps {
  message: Message;
  scrollToBottom: () => void;
  onAnimationComplete?: () => void;
}

const loadingTexts = [
  'Spinning...',
  'Pondering...',
  'Computing...',
  'Thinking...',
  'Processing...',
  'Analyzing...',
  'Contemplating...',
  'Calculating...',
  'Cogitating...'
];

const LoadingIndicator: React.FC = () => {
    const [currentText, setCurrentText] = useState('');
    const textIndex = useRef(0);
    const animationTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        let charIndex = 0;
        let isMounted = true; // Flag to prevent updates after unmount

        const type = () => {
            if (!isMounted) return;

            const message = loadingTexts[textIndex.current];
            
            // Check if we are still typing the current message
            if (charIndex < message.length) {
                // Set the text to the substring of the current message
                setCurrentText(message.substring(0, charIndex + 1));
                charIndex++;
                // Schedule the next character
                animationTimeoutRef.current = window.setTimeout(type, 80);
            } else {
                // Finished typing, wait before starting the next word
                charIndex = 0; // Reset for the next word
                textIndex.current = (textIndex.current + 1) % loadingTexts.length;
                animationTimeoutRef.current = window.setTimeout(type, 3000); // Wait 3 seconds
            }
        };

        // Start the animation
        animationTimeoutRef.current = window.setTimeout(type, 100);

        // Cleanup function to stop animation on component unmount
        return () => {
            isMounted = false;
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, []); // Empty dependency array ensures this runs only on mount/unmount


    return <div className="text-[#8360c3] font-medium min-w-[120px]">{currentText}</div>;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, scrollToBottom, onAnimationComplete }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? '' : 'bg-white border border-gray-200'}`}>
          {isUser ? <UserIcon /> : <RealVisionBotIcon />}
        </div>
        <div className="flex flex-col gap-1.5 w-full">
            <div className={`text-[#344054] text-sm font-bold ${isUser ? 'text-right' : 'text-left'} ${message.isLoading && !message.thinkingSteps ? 'h-10 flex items-center' : ''}`}>
               {isUser ? 'You' : (message.isLoading && !message.thinkingSteps ? <LoadingIndicator /> : 'RealVision')}
            </div>

            {message.thinkingSteps && <ThinkingBox steps={message.thinkingSteps} onAnimationComplete={onAnimationComplete} scrollToBottom={scrollToBottom} />}

            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {message.text && (
                    <div className={`max-w-[90%] md:max-w-[75%] lg:max-w-[65%] text-sm rounded-lg px-3 py-2 shadow-sm ${
                      isUser
                        ? 'bg-[#0057d8] text-white'
                        : 'bg-white text-[#667085] border border-gray-200'
                    }`}>
                      <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-table:my-2 prose-th:bg-gray-50 prose-table:text-sm whitespace-pre-wrap">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;