'use client';

import React, { useState, useEffect } from 'react';

// Components
import SettingsPanel from '@/components/SettingsPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import ConversationSelector from '@/components/ConversationSelector';

// Hooks
import { useBackgroundEffects } from '@/hooks/useBackgroundEffects';
import { useChat } from '@/hooks/useChat';

export default function HomePage() {
  const [showSettings, setShowSettings] = useState(false);

  // Custom hooks for modular functionality
  const backgroundEffects = useBackgroundEffects();
  const chat = useChat();

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-scroll-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chat.messages]);

  const toggleSettings = () => setShowSettings(!showSettings);

  // Simplified send message using AI SDK
  const handleSendMessage = async () => {
    if (!chat.input.trim()) return;

    // AI SDK will handle everything: user message, API call, and AI response
    await chat.sendMessage(chat.input);
  };  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Effects Container */}
      <div 
        ref={backgroundEffects.effectContainerRef}
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: backgroundEffects.EFFECTS_ENABLED ? 1 : 0 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-purple-900/25"></div>
      </div>

      {/* Header */}
      <Header 
        toggleSettings={toggleSettings} 
        activeEffectInstance={backgroundEffects.activeEffectInstance}
        EFFECTS_ENABLED={backgroundEffects.EFFECTS_ENABLED}
      />

      {/* Settings Panel */}
      <SettingsPanel
        showSettings={showSettings}
        toggleSettings={toggleSettings}
        EFFECTS_ENABLED={backgroundEffects.EFFECTS_ENABLED}
        setEffectsEnabled={backgroundEffects.setEffectsEnabled}
        currentEffect={backgroundEffects.currentEffect}
        handleEffectChange={backgroundEffects.handleEffectChange}
        backgroundEffectOptions={backgroundEffects.backgroundEffectOptions}
      />

      {/* Settings Overlay */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
          onClick={toggleSettings}
        />
      )}

      {/* Main Chat Content */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full relative z-20">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          
          {/* Conversation Selector */}
          <ConversationSelector
            conversations={chat.conversations}
            currentConversationId={chat.currentConversationId}
            onConversationSelect={chat.switchConversation}
            onNewConversation={chat.createNewConversation}
          />

          {/* Chat Messages */}
          <ChatMessages 
            messages={chat.messages}
            isLoading={chat.isLoading}
          />

          {/* Error Display */}
          {chat.error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-200 text-sm">
              {chat.error.message || 'An error occurred'}
            </div>
          )}

          {/* Chat Input */}
          <ChatInput
            value={chat.input}
            onChange={chat.setInput}
            onSend={handleSendMessage}
            isLoading={chat.isLoading}
            placeholder="Ask Southern Cross AI anything..."
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}