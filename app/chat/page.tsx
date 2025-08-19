import { redirect } from 'next/navigation';
import { createConversation } from '@/utils/chat-store';
import { createClient } from '@/utils/supabase/server';

export default async function NewChatPage() {
  // Check if user is authenticated first
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
    const conversationId = await createConversation();
    redirect(`/chat/${conversationId}`);
}
