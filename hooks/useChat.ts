import { useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useChat(conversationId?: string, initialMessages?: UIMessage[]) {
  const [input, setInput] = useState('');
  const router = useRouter();
  
  const { messages, sendMessage, status, error, stop } = useAIChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // Send only the last message to reduce payload
      prepareSendMessagesRequest({ messages, id }) {
        return { 
          body: { 
            message: messages[messages.length - 1], 
            conversationId: id 
          } 
        };
      },
    }),
    onError: (error: Error) => {
      console.error('AI Chat Error:', error);
    }
  });

  // Custom send message wrapper
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    // Clear input
    setInput('');

    // Send to AI using AI SDK
    await sendMessage({ text: messageContent });
  };

  const createNewConversation = async () => {
    // Navigate to new chat page which will create conversation server-side
    router.push('/chat');
  };

  const switchConversation = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  return {
    // AI SDK message management
    messages,
    sendMessage: handleSendMessage,
    isLoading: status === 'submitted' || status === 'streaming',
    error,
    stop,
    status,
    
    // Input management
    input,
    setInput,
    
    // Navigation functions
    currentConversationId: conversationId,
    switchConversation,
    createNewConversation,
  };
}
