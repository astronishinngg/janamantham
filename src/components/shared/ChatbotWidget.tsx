import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useEngineStore } from '@/stores/useEngineStore';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am the JanaManthan Decision Intelligence Assistant. Ask me anything about the platform features, engine pipeline, or reports.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeAnalysisId, activeDataset } = useEngineStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const originalText = messageText;
    setMessageText('');
    setIsLoading(true);

    const upload_id = activeAnalysisId || activeDataset?.id || null;

    try {
      const response = await api.post('/chat', { 
        message: originalText,
        upload_id: upload_id
      });
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I am having trouble connecting to the chat service. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden font-['Inter']">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-[#0B2E59] hover:bg-[#F57C00] text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer focus:outline-none"
            title="Ask JanaManthan Assistant"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="w-80 sm:w-96 h-[480px] bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0B2E59] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#F57C00]" />
                </div>
                <div>
                  <h3 className="font-['Poppins'] font-bold text-sm">JanaManthan Assistant</h3>
                  <span className="text-[10px] text-green-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        isUser 
                          ? 'bg-[#0B2E59] text-white rounded-tr-none' 
                          : 'bg-white border border-[#E2E8F0] text-slate-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={`block text-[9px] mt-1.5 ${isUser ? 'text-white/60 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B2E59]" />
                    <span className="text-xs text-slate-500 font-semibold">Assistant is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E2E8F0] flex gap-2 items-center bg-white">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs outline-none focus:border-[#0B2E59] transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !messageText.trim()}
                className="p-2 bg-[#0B2E59] hover:bg-[#F57C00] text-white rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
