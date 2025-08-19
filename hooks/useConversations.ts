import { useState, useCallback, useEffect } from 'react';

export interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  lastUpdated: Date;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, name: 'Current conversation', messages: [], lastUpdated: new Date() }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const switchConversation = useCallback((conversationId: number) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
    }
  }, [conversations]);

  const createNewConversation = useCallback(() => {
    const newId = Math.max(...conversations.map(c => c.id), 0) + 1;
    const newConversation: Conversation = {
      id: newId,
      name: `Conversation ${newId}`,
      messages: [],
      lastUpdated: new Date()
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newId);
    setMessages([]);
  }, [conversations]);

  const updateConversationMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: newMessages, lastUpdated: new Date() }
        : conv
    ));
  }, [currentConversationId]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, newMessage];
    updateConversationMessages(updatedMessages);
    
    return newMessage;
  }, [messages, updateConversationMessages]);

  // Sync messages when conversation changes
  useEffect(() => {
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (conversation) {
      setMessages(conversation.messages);
    }
  }, [currentConversationId, conversations]);

  return {
    conversations,
    currentConversation,
    currentConversationId,
    messages,
    switchConversation,
    createNewConversation,
    addMessage,
    updateConversationMessages
  };
}
