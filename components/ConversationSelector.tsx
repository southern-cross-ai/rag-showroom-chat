'use client';

import React, { useState } from 'react';
import { StoredConversation } from '@/utils/chat-store';

interface ConversationSelectorProps {
  conversations: StoredConversation[];
  currentConversationId?: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationSelector({ 
  conversations, 
  currentConversationId, 
  onConversationSelect, 
  onNewConversation 
}: ConversationSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="mb-6 relative">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <button
            className="w-full bg-white/8 hover:bg-white/12 backdrop-blur-sm border border-white/25 hover:border-white/40 rounded-2xl p-4 text-left transition-all duration-200 flex items-center justify-between"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div>
              <h3 className="text-lg font-semibold text-white">
                {currentConversation?.title || 'Select Conversation'}
              </h3>
              <p className="text-xs text-gray-400">
                {currentConversationId ? 'Active conversation' : 'No conversation selected'}
              </p>
            </div>
            <div className={`transform transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/25 rounded-2xl p-2 shadow-2xl shadow-black/50 z-10">
              <div className="max-h-64 overflow-y-auto space-y-1">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      conversation.id === currentConversationId
                        ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-100'
                        : 'hover:bg-white/10 text-white'
                    }`}
                    onClick={() => {
                      onConversationSelect(conversation.id);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="font-medium">{conversation.title}</div>
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>Created {new Date(conversation.created_at).toLocaleDateString()}</span>
                      <span className="text-cyan-400">{conversation.total_tokens.toLocaleString()} tokens</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25"
          onClick={onNewConversation}
        >
          + New
        </button>
      </div>
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
