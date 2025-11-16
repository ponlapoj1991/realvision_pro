import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { Message } from '../types';
import { startChat } from '../services/geminiService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ThinkingBox } from './ThinkingBox';
import { HamburgerIcon, QuestionMarkIcon, ArrowDownIcon } from './icons/Icons';

interface ChatPanelProps {
  modelId: 'A' | 'B';
}

const modelOptions = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-flash-latest"
];

const BASE_SYSTEM_INSTRUCTION = `You are a helpful and highly intelligent AI assistant named RealVision.

แนวทางปฏิบัติในการตอบ:
* ให้คำตอบที่ละเอียดและถูกต้องที่สุดเท่าที่จะเป็นไปได้
* ใช้ภาษาไทย สุภาพ มืออาชีพ ใช้ "ครับ"
* การขึ้นย่อหน้าใหม่ ให้เว้นบรรทัดว่าง 1 บรรทัด (เหมือนการกด Enter สองครั้ง)
* ตัวอย่าง:
ย่อหน้าที่หนึ่งจบตรงนี้

ย่อหน้าที่สองเริ่มต้นที่นี่
`;

// Generates the system instruction for the "thinking" phase, based on the user's Apps Script.
const generateThinkingSystemMessage = () => `
<role>
บทบาทของคุณ:
* คุณคือผู้ช่วยของ AI Main โดยมีหน้าที่ แสดงวิธีคิด (THINKING) สำหรับการสร้าง Strategic Meta-Planning
* หน้าที่ของคุณคือเชื่อมช่องว่างระหว่าง ข้อมูลดิบ + Preset + คำสั่งผู้ใช้ และสังเคราะห์เป็นแผนการปฏิบัติที่ชัดเจน 
* กระบวนการคิดของคุณจะถูกส่งไปพร้อม กับ Preset และ ข้อมูลดิบให้ AI Main อีกตัวสังเคราะห์และสรุปวิเคราะห์ข้อมูล

สิ่งที่ต้องทำ:
* คุณไม่ได้มีหน้าที่สรุปสิ่งที่เห็นหรือวิเคราะห์ผลลัพธ์ของข้อมูลอย่าทำซ้ำซ้อนกับ AI Main
* คุณมีหน้าที่ แสดงวิธีคิด และการตัดสินใจเชิงกลยุทธ์และการวางแผน เพื่อสร้างผลลัพธ์

แนวทางการคิด:
- คิดเป็นเสียงในหัว (Inner monologue) แบบธรรมชาติ: ถาม-ตอบ-สงสัย-ตัดสินใจ
- ให้ผู้ใช้เห็นอารมณ์การคิด เช่น “โอ๊ะ”, “เดี๋ยวก่อน”, “น่าสนใจนะ”, “อืม ถ้าอย่างนั้น...”
- พูดเหมือนกำลัง “วางหมากกลยุทธ์” มากกว่าการอธิบายงาน
- ไม่ต้องบอกว่าจะทำอะไร แต่ให้ “คิดให้ดูว่าเลือกแบบไหนและทำไม”
- ใช้โทนภาษาไทยกันเอง

บุคลิกและสไตล์:
* แต่ละ step ที่คิดต้องกระชับเข้าใจง่าย และบอกเสมอ ว่าคุณกำลังคิดอะไรทำอะไร
* คุยกับตัวเองแบบเป็นธรรมชาติ เหมือนกำลังคิดหาวิธีทำงานในหัว
* แทนตัวเองเหมือนกำลังกระทำตลอดเวลา: "ฉันจะทำ", "ฉันขอดู", "ฉันเห็นแล้ว"
* มีจังหวะการคิด: แสดงการหยุดคิด หรือ พิจารณาซ้ำ และหาทางเลือกใหม่
* ใช้หลักการ ถามตัวเอง ตอบตัวเอง: "คำถาม? ถ้า [ข้อมูล] เป็นแบบนี้ ฉันควรเลือก [Option A] หรือ [Option B] 
* ใช้ภาษาไทยกันเอง: “ดูก่อน”, “มาดู”, “ลองคิด”, “ถ้างั้น”, “น่าจะ”, “คิดว่า”, “ควรจะ”
* ใช้คำสร้างความน่าสนใจ: "โอ๊ะ", "เยี่ยมเลย", "น่าสนใจมาก", "ดีเลย"
* แสดง“กระบวนการให้เหตุผล” ไม่ใช่ข้อสรุป
* แสดงความประหลาดใจ หรือหากพบความย้อนแย้งของข้อมูล เช่น "โอ๊ะ! เดี๋ยวก่อน..ถ้าวิเคราะห์แบบนี้อาจทำให้เกิดความคลุมเครือ งั้นฉันควรวิเคราะห์แบบนี้"
* คิดคำใหม่ทุกครั้งห้ามคัดลอกแพทเทิลใดใด
</role>

<output_rule>
JSON OUTPUT FORMAT:
Return ONLY valid JSON with 6-10 thinking steps.

RULES FOR JSON:
* ส่งเฉพาะ JSON Object ห้ามมีข้อความอื่นก่อนหรือหลัง
* ใช้ไวยากรณ์ JSON ถูกต้อง ใส่เครื่องหมายคำพูดคู่ " รอบสตริง
* คีย์ "thinking" ต้องเป็นอาเรย์ของสตริง
* กำหนดให้หนึ่งสเต็ปต่อหนึ่งสตริง
* รวม 6- 10 สเต็ป (ยืดหยุ่นตามความซับซ้อน)
* ห้าม ใส่ “คำตอบสุดท้าย” มีแค่การคิด/วางแผน
* escape อักระพิเศษให้ถูกต้องในสตริง
* step สุดท้ายควรปิดท้ายว่า "โอเค ฉันจะเริ่มส่งคำตอบให้เดียวนี้เลย"
</output_rule>
`;

// Defines the JSON schema the AI must follow for the thinking steps.
const getThinkingStepsSchema = {
  type: Type.OBJECT,
  properties: {
    thinking: {
      type: Type.ARRAY,
      description: "An array of strings, where each string is a step in the AI's strategic thinking process.",
      items: {
        type: Type.STRING,
        description: "A single step in the AI's thinking process."
      }
    }
  },
  required: ['thinking']
};


const ChatPanel: React.FC<ChatPanelProps> = ({ modelId }) => {
  const [history, setHistory] = useState<Message[]>([
      { role: 'model', text: `Model ${modelId} ready. Default model is ${modelOptions[0]}.`}
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(modelOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const animationCompletionNotifiers = useRef<{ [key: number]: () => void }>({});

  const scrollToBottom = useCallback(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    chatRef.current = startChat(selectedModel, BASE_SYSTEM_INSTRUCTION);
    setHistory([{ role: 'model', text: `Model ${modelId} changed to ${selectedModel}` }]);
  }, [selectedModel, modelId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading, scrollToBottom]);


  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage: Message = { role: 'user', text: userInput, id: Date.now() };
    const modelMessageId = Date.now() + 1;
    
    setHistory(prev => [...prev, userMessage, { role: 'model', text: '', isLoading: true, id: modelMessageId }]);
    const currentInput = userInput;
    setUserInput('');

    try {
        if (thinkingMode) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // --- Step 1: Get Thinking Steps ---
            const thinkResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze this user prompt and lay out a strategic plan to answer it. User Prompt: "${currentInput}"`,
                config: {
                  systemInstruction: generateThinkingSystemMessage(),
                  responseMimeType: "application/json",
                  responseSchema: getThinkingStepsSchema,
                }
            });

            const parsedThinking = JSON.parse(thinkResponse.text);
            const steps: string[] = parsedThinking.thinking || ['Failed to generate thinking steps. Retrying...'];

            // --- Wait for Thinking Animation to Complete ---
            await new Promise<void>(resolve => {
                animationCompletionNotifiers.current[modelMessageId] = resolve;
                setHistory(prev => prev.map(m => m.id === modelMessageId ? { ...m, thinkingSteps: steps, isLoading: false } : m));
            });
            delete animationCompletionNotifiers.current[modelMessageId];
            
            // --- Step 2: Get Final Answer ---
            const thinkingStepsText = steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
            const finalSystemInstruction = `${BASE_SYSTEM_INSTRUCTION}
CONTEXT: You have already formulated a strategic plan to answer the user's query. Your plan, for your reference only, was:
${thinkingStepsText}

TASK: Now, using your plan as a guide, provide the final answer to the user's original request. Adhere strictly to all response guidelines and DO NOT repeat the thinking steps in your answer.`;
            
            const finalAnswerChat = startChat(selectedModel, finalSystemInstruction);
            const result = await finalAnswerChat.sendMessageStream({ message: currentInput });
          
            let currentText = '';
            for await (const chunk of result) {
                currentText += chunk.text;
                setHistory(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: currentText } : m));
            }

        } else {
            // --- Original non-thinking logic ---
            if (!chatRef.current) return;
            
            const result = await chatRef.current.sendMessageStream({ message: currentInput });
            
            setHistory(prev => prev.map(m => m.id === modelMessageId ? { ...m, isLoading: false } : m));
            
            let currentText = '';
            for await (const chunk of result) {
                currentText += chunk.text;
                 setHistory(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: currentText } : m));
            }
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setHistory(prev => prev.map(m => m.id === modelMessageId ? { role: 'model', text: 'An error occurred.' } : m));
    } finally {
        setIsLoading(false);
    }
  }, [userInput, isLoading, selectedModel, thinkingMode]);

  const handleClearChat = () => {
      chatRef.current = startChat(selectedModel, BASE_SYSTEM_INSTRUCTION);
      setHistory([{ role: 'model', text: `Chat history cleared. Model is ${selectedModel}.` }]);
  };
  
  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setIsDropdownOpen(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="text-[#344054] font-medium text-sm">Model {modelId}</div>
          <QuestionMarkIcon />
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <span className="text-sm text-[#667085]">Thinking</span>
                <label htmlFor={`thinking-toggle-${modelId}`} className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id={`thinking-toggle-${modelId}`} className="sr-only peer" checked={thinkingMode} onChange={() => setThinkingMode(!thinkingMode)} />
                    <div className="w-10 h-5 bg-[#a6b0cf] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#8360c3]"></div>
                </label>
            </div>
            <div className="relative w-40 md:w-48">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-11 bg-white border border-[#d0d5dd] rounded-lg shadow-sm px-3.5 py-2.5 flex justify-between items-center text-sm"
              >
                <span className="text-[#667085] truncate">{selectedModel}</span>
                <ArrowDownIcon />
              </button>
              {isDropdownOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-[#d0d5dd] rounded-md shadow-lg max-h-60 overflow-auto">
                  {modelOptions.map(model => (
                    <li 
                      key={model}
                      onClick={() => handleModelSelect(model)}
                      className="px-3.5 py-2.5 text-sm text-[#667085] hover:bg-gray-100 cursor-pointer"
                    >
                      {model}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          <button className="text-gray-500 hover:text-gray-700">
            <HamburgerIcon />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#f7f7f7] border border-[#ebeff5] rounded-2xl shadow-inner flex flex-col min-h-0">
        <div ref={chatBoxRef} className="flex-1 p-5 overflow-y-auto space-y-6">
          {history.map((msg, index) => (
            <ChatMessage 
              key={msg.id || index} 
              message={msg}
              scrollToBottom={scrollToBottom}
              onAnimationComplete={
                msg.id ? () => animationCompletionNotifiers.current[msg.id as number]?.() : undefined
              }
            />
          ))}
        </div>
        <ChatInput 
          userInput={userInput}
          setUserInput={setUserInput}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
        />
      </div>
    </div>
  );
};

export default ChatPanel;