'use client';

import React from 'react';
import { UIMessage } from 'ai';

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="bg-white/2 backdrop-blur-sm border border-white/15 rounded-3xl mb-6 h-96 shadow-2xl shadow-black/20 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
      
      <div className="p-6 flex-1 overflow-y-auto chat-scroll-container">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
              </div>
              <p className="text-gray-400 text-sm">Start a conversation with Southern Cross AI</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-100' 
                    : 'bg-white/10 border border-white/20 text-white'
                }`}> 
                {message.parts.map((part, index) => (
                    (() => {
                        switch (part.type) {
                            case 'text':
                                return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
                            case 'step-start':
                                return null;
                            default:
                                return <p key={index} className="text-xs opacity-60 mt-1">{part.type} not supported.</p>;
                        }
                    })()
                ))}
                  <p className="text-xs opacity-60 mt-1">
                    {/* {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-300">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
