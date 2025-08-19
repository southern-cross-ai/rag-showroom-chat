import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, createIdGenerator } from 'ai';
import { loadConversation, saveConversation } from '@/utils/chat-store';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message, conversationId }: { message: UIMessage; conversationId: string } = await req.json();

  // Load previous messages from database
  const previousMessages = await loadConversation(conversationId);

  // Append new message to previous messages
  const messages = [...previousMessages, message];

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    // Generate consistent server-side IDs for persistence
    generateMessageId: createIdGenerator({
      prefix: 'msg',
      size: 16,
    }),
    onFinish: ({ messages }) => {
      // Save the complete conversation including the new AI response
      saveConversation({ conversationId, messages });
    },
  });
}