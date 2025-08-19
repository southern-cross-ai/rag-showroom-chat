import { createClient } from '@/utils/supabase/server';
import { UIMessage } from 'ai';

export interface StoredConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// Server-side functions (for API routes)
export async function createConversation(title: string = 'New Conversation'): Promise<string> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated' + userError?.message);
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({ 
      title,
      user_id: user.id  // Set the user_id for RLS policy
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function loadConversation(conversationId: string): Promise<UIMessage[]> {
  const supabase = await createClient();

  
  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content')
    .eq('conversation_id', conversationId)
    .order('message_index', { ascending: true });

  if (error) throw error;
  
  // Convert stored messages back to UIMessage format
  return data.map(msg => ({
    id: msg.id,
    role: msg.role as any,
    ...msg.content // Spread the stored content (parts, createdAt, etc.)
  }));
}

export async function saveConversation({
  conversationId,
  messages,
}: {
  conversationId: string;
  messages: UIMessage[];
}): Promise<void> {
  const supabase = await createClient();

  // First, delete existing messages for this conversation
  await supabase
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId);

  // Then insert all messages
  const messagesToInsert = messages.map((msg, index) => ({
    id: msg.id,
    conversation_id: conversationId,
    role: msg.role,
    content: {
      parts: msg.parts,
      // Include any other UIMessage properties except createdAt which might not exist
      ...(msg as any).createdAt && { createdAt: (msg as any).createdAt },
    },
    message_index: index,
  }));

  if (messagesToInsert.length > 0) {
    const { error } = await supabase
      .from('messages')
      .insert(messagesToInsert);

    if (error) throw error;
  }
}

export async function getUserConversations(): Promise<StoredConversation[]> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', conversationId);

  if (error) throw error;
}
