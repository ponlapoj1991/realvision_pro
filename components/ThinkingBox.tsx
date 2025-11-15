import React, { useState, useEffect, useRef } from 'react';

interface ThinkingBoxProps {
    steps: string[];
    onAnimationComplete?: () => void;
    scrollToBottom: () => void;
}

export const ThinkingBox: React.FC<ThinkingBoxProps> = ({ steps, onAnimationComplete, scrollToBottom }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [displayedSteps, setDisplayedSteps] = useState<string[]>([]);
    const [hasAnimated, setHasAnimated] = useState(false);
    const animationTimeoutRef = useRef<number | null>(null);

    // Calculate a minimum height to prevent layout shifts during animation.
    // Assuming each step will take up at least one line (1.25rem).
    const minHeight = steps ? `${steps.length * 1.25}rem` : '0rem';

    useEffect(() => {
        if (hasAnimated || !steps || steps.length === 0) return;

        setDisplayedSteps(Array(steps.length).fill('')); // Initialize with empty strings

        let currentStepIndex = 0;
        let currentWordIndex = 0;

        const animate = () => {
            if (currentStepIndex >= steps.length) {
                // All steps are done, trigger callback and set flag
                setHasAnimated(true);
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
                return; 
            }
            
            // Use a robust regex to split words, handling any kind of whitespace and preventing empty tokens.
            const currentStepWords = (steps[currentStepIndex] || '').match(/\S+/g) || [];
            
            if (currentWordIndex < currentStepWords.length) {
                // Type the next word
                setDisplayedSteps(prev => {
                    const newSteps = [...prev];
                    const existingText = newSteps[currentStepIndex] ? newSteps[currentStepIndex] + ' ' : '• ';
                    // Defensively grab the word to prevent 'undefined' from ever being concatenated
                    const nextWord = currentStepWords[currentWordIndex] || '';
                    newSteps[currentStepIndex] = existingText + nextWord;
                    return newSteps;
                });
                
                currentWordIndex++;
                
                // Immediately scroll to bottom as new text is added
                scrollToBottom();
                
                // Set timeout for the next word for a more natural typing effect
                const delay = 100 + Math.random() * 50;
                animationTimeoutRef.current = window.setTimeout(animate, delay);

            } else {
                // Current step is finished, move to the next one
                currentStepIndex++;
                currentWordIndex = 0;
                
                // Set a longer timeout for the next step to start, creating a pause
                const delay = 500;
                animationTimeoutRef.current = window.setTimeout(animate, delay);
            }
        };

        // Start the animation
        animationTimeoutRef.current = window.setTimeout(animate, 300);

        // Cleanup function
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [steps, onAnimationComplete, hasAnimated, scrollToBottom]);

    if (!steps || steps.length === 0) return null;

    return (
        <div className="bg-gray-100/80 border border-gray-200/90 rounded-lg p-3 max-w-[90%] md:max-w-[75%] lg:max-w-[65%] text-sm">
            <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
                role="button"
                aria-expanded={!isCollapsed}
            >
                <div className="font-semibold text-gray-600">
                    💭 Thinking...
                </div>
                <div className="text-gray-500 transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                    </svg>
                </div>
            </div>
            {!isCollapsed && (
                <div 
                    className="mt-2 space-y-2 pl-2 border-l-2 border-purple-300"
                    style={{ minHeight: minHeight }}
                >
                    {displayedSteps.map((step, index) => (
                       step && <p key={index} className="text-gray-600 text-xs min-h-[1.25rem]">{step}</p> 
                    ))}
                </div>
            )}
        </div>
    );
};