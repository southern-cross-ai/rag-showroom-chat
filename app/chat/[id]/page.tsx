import { loadConversation, getUserConversations } from '@/utils/chat-store';
import ChatPage from '@/components/ChatPage';

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Load both the conversation messages and all user conversations server-side
    const [initialMessages, conversations] = await Promise.all([
      loadConversation(id),
      getUserConversations(),
    ]);

    return (
      <ChatPage
        conversationId={id}
        initialMessages={initialMessages}
        conversations={conversations}
      />
    );
  } catch (error) {
    console.error('Error loading conversation:', error);
    // If conversation doesn't exist or there's an error, still load user conversations
    try {
      const conversations = await getUserConversations();
      return <ChatPage conversationId={id} initialMessages={[]} conversations={conversations} />;
    } catch (fallbackError) {
      // Final fallback
      console.error('Error loading conversations:', fallbackError);
      return <ChatPage conversationId={id} initialMessages={[]} conversations={[]} />;
    }
  }
}
