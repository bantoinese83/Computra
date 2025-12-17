import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { GoogleGenAI } from "@google/genai";
import { RecommendationResult, UserPreferences } from '../types';
import { LIMITS, ICON_SIZES, SPACING, PERCENTAGE } from '../constants';
import { logger } from '../utils/logger';
import LoadingAnimation from './LoadingAnimation';

interface Props {
  recommendation: RecommendationResult;
  preferences: UserPreferences;
}

const GeminiAssistant: React.FC<Props> = ({ recommendation, preferences }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "[NOVA_INIT] I'm Nova, your compute copilot. I can explain GPU recommendations or help estimate costs. [QUERY_READY]" }
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
        userMessage: userMsg.substring(0, LIMITS.LOG_MESSAGE_MAX_LENGTH),
        hasRecommendation: !!recommendation,
      });
      setMessages(prev => [...prev, { role: 'model', text: "[ERROR] Connection failed. [RETRY] Please try again." }]);
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
          className="fixed bottom-8 right-8 border border-ice-cyan bg-surface text-ice-cyan p-4 pr-6 hover:bg-surface-light transition-all hover:cyber-glow z-50 flex items-center gap-3 group animate-in zoom-in duration-300 font-mono"
        >
          <div className="border border-ice-cyan bg-surface-light p-2 group-hover:rotate-12 transition-transform">
            <img
              src="/robotic-icon.svg"
              alt="Nova compute copilot"
              className="h-7 w-7"
            />
          </div>
          <span className="font-bold text-sm tracking-wide">[ASK_NOVA]</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[24rem] h-[32rem] bg-surface border border-border flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-10 zoom-in-95 duration-300 cyber-glow">
          
          {/* Header */}
          <div className="bg-surface-light p-4 flex justify-between items-center border-b border-border absolute w-full top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-ice-cyan flex items-center justify-center">
                <Icon name="bot" size={ICON_SIZES.LG} className="text-ice-cyan" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm font-mono">[NOVA]</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ice-cyan animate-pulse"></span>
                    <span className="text-[10px] font-mono text-ice-cyan uppercase tracking-wider">[ONLINE]</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-surface p-2 transition-colors text-ice-cyan focus:outline-none focus:ring-2 focus:ring-ice-cyan focus:ring-offset-2 focus:ring-offset-void"
              aria-label="Close chat"
            >
              <Icon name="close" size={ICON_SIZES.LG} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 pt-20 space-y-6 bg-void scrollbar-thin scrollbar-thumb-border">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-5 py-3.5 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-surface-light border border-ice-cyan text-ice-cyan' 
                      : 'bg-surface border border-border text-text-muted'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border p-4 flex items-center gap-3">
                  <LoadingAnimation size={40} />
                  <span className="text-xs text-text-muted font-mono">[PROCESSING]</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-surface-light border-t border-border">
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
                placeholder="[INPUT_QUERY]"
                className="w-full bg-surface border border-border pl-4 pr-12 py-3.5 text-sm text-white focus:border-ice-cyan focus:ring-2 focus:ring-ice-cyan focus:ring-offset-2 focus:ring-offset-surface-light transition-all outline-none font-mono placeholder:text-text-muted"
                aria-label="Chat input"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 border border-ice-cyan bg-surface text-ice-cyan hover:bg-surface-light disabled:border-border disabled:text-text-muted p-2 transition-colors"
              >
                <Icon name="send" size={ICON_SIZES.MD} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;


