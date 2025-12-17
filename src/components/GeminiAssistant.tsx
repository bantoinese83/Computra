import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from './Icon';
import { GoogleGenAI } from "@google/genai";
import { RecommendationResult, UserPreferences, ProviderOffer, GpuSpec } from '../types';
import { LIMITS, ICON_SIZES, SPACING, PERCENTAGE } from '../constants';
import { logger } from '../utils/logger';
import LoadingAnimation from './LoadingAnimation';

interface Props {
  recommendation: RecommendationResult;
  preferences: UserPreferences;
  offers: ProviderOffer[];
  gpuSpecs: Record<string, GpuSpec>;
}

const GeminiAssistant: React.FC<Props> = ({ recommendation, preferences, offers, gpuSpecs }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize with context-aware message
  const getInitialMessage = () => {
    if (offers.length > 0) {
      const topOffer = offers[0];
      const gpuName = gpuSpecs[topOffer.gpuId]?.name || topOffer.gpuId;
      return `[NOVA_INIT] I'm Nova, your compute copilot. I've analyzed your workload and found ${offers.length} provider offers. The top recommendation is ${gpuName} from ${topOffer.providerName} at $${topOffer.pricePerHour.toFixed(3)}/hr. Ask me about any offer, pricing, or specifications. [QUERY_READY]`;
    }
    return "[NOVA_INIT] I'm Nova, your compute copilot. I can explain GPU recommendations or help estimate costs. [QUERY_READY]";
  };

  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: getInitialMessage() }
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
      
      // Build comprehensive context with all results data
      const offersSummary = offers.map((offer, idx) => {
        const gpu = gpuSpecs[offer.gpuId];
        return {
          rank: idx + 1,
          provider: offer.providerName,
          gpuModel: gpu?.name || offer.gpuId,
          gpuId: offer.gpuId,
          pricePerHour: offer.pricePerHour,
          region: offer.region,
          commitment: offer.commitment,
          url: offer.url,
          isVerified: offer.isVerified || false,
          specs: gpu ? {
            vram: gpu.vram,
            fp16Tflops: gpu.fp16Tflops,
            tier: gpu.tier,
          } : null,
        };
      });

      // Build GPU specs summary
      const gpuSpecsSummary = Object.entries(gpuSpecs).map(([model, specs]) => ({
        model,
        name: specs.name,
        vram: specs.vram,
        fp16Tflops: specs.fp16Tflops,
        tier: specs.tier,
      }));

      const context = `
You are Nova, an expert AI compute copilot for Computra, a GPU marketplace platform.

CURRENT RESULTS CONTEXT:
- Recommended GPU Tier: ${recommendation.tier}
- Total Offers Found: ${offers.length}
- User Preferences: ${JSON.stringify(preferences, null, 2)}

AVAILABLE OFFERS (ranked by relevance):
${JSON.stringify(offersSummary, null, 2)}

GPU SPECIFICATIONS DATABASE:
${JSON.stringify(gpuSpecsSummary, null, 2)}

SYSTEM RECOMMENDATION:
${JSON.stringify(recommendation, null, 2)}

INSTRUCTIONS:
- You have full visibility into all the offers shown to the user
- You can reference specific offers by rank, provider, or GPU model
- You can compare offers, explain pricing, or help choose between options
- Be concise, technical but accessible, and reference specific data when relevant
- If asked about a specific offer, use the exact data from the offers list above
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: context + "\n\nUser Question: " + userMsg }] }
        ],
        config: {
            systemInstruction: "You are Nova, a helpful and knowledgeable AI assistant for Computra. You have full access to the user's search results, offers, and GPU specifications. Answer questions based on the actual data provided, referencing specific offers, prices, and specs when relevant."
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
                  {msg.role === 'model' ? (
                    <ReactMarkdown
                      components={{
                        // Headings
                        h1: ({ children }) => <h1 className="text-white font-bold font-mono uppercase tracking-wide text-base mb-2 mt-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-white font-bold font-mono uppercase tracking-wide text-sm mb-2 mt-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-white font-bold font-mono uppercase tracking-wide text-sm mb-2 mt-3">{children}</h3>,
                        // Paragraphs
                        p: ({ children }) => <p className="text-text-muted leading-relaxed my-2">{children}</p>,
                        // Strong/Bold
                        strong: ({ children }) => <strong className="text-ice-cyan font-bold">{children}</strong>,
                        // Code blocks
                        code: ({ className, children, ...props }) => {
                          const isInline = !className;
                          if (isInline) {
                            return (
                              <code className="text-ice-cyan bg-surface-light px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                {children}
                              </code>
                            );
                          }
                          return (
                            <pre className="bg-surface-light border border-border p-3 rounded overflow-x-auto my-2">
                              <code className="text-ice-cyan text-xs font-mono block" {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        },
                        // Links
                        a: ({ href, children }) => (
                          <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-ice-cyan underline hover:text-ice-cyan-bright transition-colors"
                          >
                            {children}
                          </a>
                        ),
                        // Lists
                        ul: ({ children }) => <ul className="text-text-muted my-2 list-disc pl-5 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="text-text-muted my-2 list-decimal pl-5 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="my-1">{children}</li>,
                        // Blockquotes
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-ice-cyan pl-4 italic text-text-muted my-2">
                            {children}
                          </blockquote>
                        ),
                        // Horizontal rule
                        hr: () => <hr className="border-border my-4" />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <span>{msg.text}</span>
                  )}
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


