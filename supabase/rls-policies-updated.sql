-- RLS Policies for RAG Showroom Chat
-- Run this after creating the schema

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;

DROP POLICY IF EXISTS "Users can view messages from their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can update messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can delete messages from their conversations" ON messages;

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
  ON conversations 
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON conversations 
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations 
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON conversations 
  FOR DELETE
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages from their conversations"
  ON messages 
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their conversations"
  ON messages 
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their conversations"
  ON messages 
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their conversations"
  ON messages 
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON messages TO authenticated;
