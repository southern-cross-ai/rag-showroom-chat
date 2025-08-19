import { useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { useConversations } from './useConversations';

export function useChat() {
  const conversations = useConversations();
  const [input, setInput] = useState('');
  
  const { messages, sendMessage, status, error, stop } = useAIChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish: (message) => {
      // When AI response finishes, save to conversation history
      conversations.addMessage({
        role: 'assistant',
        content: getMessageText(message.message)
      });
    },
    onError: (error: Error) => {
      console.error('AI Chat Error:', error);
    }
  });

  // Helper function to extract text from UIMessage
  const getMessageText = (message: any) => {
    if (typeof message.content === 'string') {
      return message.content;
    }
    if (Array.isArray(message.content)) {
      return message.content
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('');
    }
    return '';
  };

  // Custom send message wrapper
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    // Add user message to conversation immediately
    conversations.addMessage({
      role: 'user',
      content: messageContent
    });

    // Clear input
    setInput('');

    // Send to AI using AI SDK
    await sendMessage({ text: messageContent });
  };

  return {
    // AI SDK message management
    messages,
    sendMessage: handleSendMessage,
    isLoading: status === 'submitted' || status === 'streaming',
    error,
    stop,
    status,
    
    // Input management (needed for compatibility)
    input,
    setInput,
    
    // Conversation management
    conversations: conversations.conversations,
    currentConversation: conversations.currentConversation,
    currentConversationId: conversations.currentConversationId,
    switchConversation: conversations.switchConversation,
    createNewConversation: conversations.createNewConversation
  };
}
