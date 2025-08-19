'use client';

import React from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  isLoading, 
  placeholder = "Type your message..."
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white/8 backdrop-blur-sm border border-white/25 rounded-3xl p-4 shadow-xl shadow-black/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
      
      <div className="flex gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none min-h-[44px] max-h-32 py-2"
          rows={1}
        />
        <button
          className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            value.trim() && !isLoading
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-white/10 border border-white/20 text-gray-400 cursor-not-allowed opacity-50'
          }`}
          onClick={onSend}
          disabled={!value.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
}
