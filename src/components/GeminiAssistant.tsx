import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { RecommendationResult, UserPreferences } from '../types';
import { logger } from '../utils/logger';

interface Props {
  recommendation: RecommendationResult;
  preferences: UserPreferences;
}

const GeminiAssistant: React.FC<Props> = ({ recommendation, preferences }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hi! I'm your Compute Expert AI. I can explain why these GPUs were recommended or help you estimate costs. Ask me anything!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiKey = process.env.API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || !apiKey) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const context = `
        User Preferences: ${JSON.stringify(preferences)}
        System Recommendation: ${JSON.stringify(recommendation)}
        Role: You are an expert cloud infrastructure engineer helping a founder choose GPUs.
        Task: Answer the user's question concisely based on the context above.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: context + "\n\nUser Question: " + userMsg }] }
        ],
        config: {
            systemInstruction: "You are a helpful, concise AI assistant for a GPU pricing comparison tool called Computra."
        }
      });

      const text = response.text || "I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to generate chat response from Gemini', err, {
        userMessage: userMsg.substring(0, 100), // Log first 100 chars for context
        hasRecommendation: !!recommendation,
      });
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Escape key to close chat
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!apiKey) return null;

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-white hover:bg-slate-50 text-indigo-600 p-4 pr-6 rounded-full shadow-2xl hover:shadow-indigo-500/20 transition-all hover:scale-105 z-50 flex items-center gap-3 border border-indigo-100 group animate-in zoom-in duration-300"
        >
          <div className="bg-indigo-600 text-white p-2 rounded-full shadow-md group-hover:rotate-12 transition-transform">
             <Sparkles size={20} />
          </div>
          <span className="font-bold text-sm tracking-wide">Ask AI Expert</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[24rem] h-[32rem] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-10 zoom-in-95 duration-300 ring-1 ring-slate-900/5">
          
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-100 absolute w-full top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Compute Expert</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-slate-100 p-2 rounded-full transition-colors text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 pt-20 space-y-6 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-600 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 className="animate-spin text-indigo-600" size={16} />
                  <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your question..."
                className="w-full bg-slate-100 border-transparent rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                aria-label="Chat input"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;


